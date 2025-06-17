
import re
import pandas as pd
from datetime import datetime

# --- CONFIGURATION ---
# Path to your actual data files (update as needed)
tabular_data_path = 'data/data.parquet'  # Example from log
language_data_path = 'Testicles/Testicles.csv'  # Example from log

# --- LOG PARSING ---
def parse_log_for_schema(log_path):
    """Extract column names and types from a MOSTLY AI log file."""
    with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    # Find all SourceColumn entries
    pattern = r"SourceColumn\(id='[^']+', name='([^']+)', included=True, model_encoding_type=<ModelEncodingType.([a-zA-Z0-9_]+): '[^']+'>"
    matches = re.findall(pattern, text)
    schema = [(name, dtype) for name, dtype in matches]
    return schema

# --- DATA LOADING ---
def load_data(path):
    if path.endswith('.csv'):
        return pd.read_csv(path)
    elif path.endswith('.parquet'):
        return pd.read_parquet(path)
    else:
        raise ValueError('Unsupported file type')

# --- DYNAMIC PIPELINE (EXAMPLE: TABULAR) ---
def train_tabular_model(df, schema):
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder
    # Example: Use first categorical as target, rest as features
    cat_cols = [col for col, typ in schema if 'CATEGORICAL' in typ]
    num_cols = [col for col, typ in schema if 'NUMERIC' in typ]
    if not cat_cols:
        raise ValueError('No categorical columns found for target!')
    target = cat_cols[0]
    features = num_cols + [c for c in cat_cols if c != target]
    X = df[features].copy()
    y = df[target].copy()
    # Encode categoricals
    for col in X.select_dtypes(include='object').columns:
        X[col] = LabelEncoder().fit_transform(X[col].astype(str))
    if y.dtype == 'object':
        y = LabelEncoder().fit_transform(y.astype(str))
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    acc = clf.score(X_test, y_test)
    print(f'Tabular model accuracy: {acc:.3f}')
    return clf

# --- MAIN ---
if __name__ == '__main__':
    # Example: Parse schema from log
    log_path = 'TRAIN_TABULAR-data_tabular-357ef637-909a-44ad-b570-08dfec1c2bf2-0.log'
    schema = parse_log_for_schema(log_path)
    print('Parsed schema:', schema)
    # Load data
    try:
        df = load_data(tabular_data_path)
        print('Loaded data shape:', df.shape)
        # Train model
        model = train_tabular_model(df, schema)
    except Exception as e:
        print('Data/model training error:', e)
