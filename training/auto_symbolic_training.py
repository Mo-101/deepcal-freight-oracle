
import os
import re
import pandas as pd
from glob import glob
from datetime import datetime

def find_files():
    files = glob('*.log') + glob('*.csv') + glob('*.parquet')
    return files

def parse_log_for_schema(log_path):
    with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    pattern = r"SourceColumn\(id='[^']+', name='([^']+)', included=True, model_encoding_type=<ModelEncodingType.([a-zA-Z0-9_]+): '[^']+'>"
    matches = re.findall(pattern, text)
    schema = [(name, dtype) for name, dtype in matches]
    return schema

def load_data(path):
    if path.endswith('.csv'):
        return pd.read_csv(path)
    elif path.endswith('.parquet'):
        return pd.read_parquet(path)
    else:
        raise ValueError('Unsupported file type: ' + path)

def infer_schema(df):
    schema = []
    for col in df.columns:
        dtype = str(df[col].dtype)
        if dtype.startswith('int') or dtype.startswith('float'):
            schema.append((col, 'NUMERIC'))
        elif dtype.startswith('datetime'):
            schema.append((col, 'DATETIME'))
        else:
            schema.append((col, 'CATEGORICAL'))
    return schema

def train_tabular_model(df, schema):
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder
    # Try to find a categorical column with few unique values as target
    cat_cols = [col for col, typ in schema if 'CATEGORICAL' in typ]
    num_cols = [col for col, typ in schema if 'NUMERIC' in typ]
    if not cat_cols:
        raise ValueError('No categorical columns found for target!')
    # Pick the first categorical with <20 unique values as target
    for c in cat_cols:
        if df[c].nunique() < 20:
            target = c
            break
    else:
        target = cat_cols[0]
    features = [c for c in df.columns if c != target]
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
    print(f'Tabular model accuracy (target={target}): {acc:.3f}')
    return clf

def main():
    files = find_files()
    print('Found files:', files)
    log_files = [f for f in files if f.endswith('.log')]
    data_files = [f for f in files if f.endswith('.csv') or f.endswith('.parquet')]
    schema = None
    if log_files:
        print('Parsing schema from log:', log_files[0])
        schema = parse_log_for_schema(log_files[0])
    for data_path in data_files:
        print(f'
Loading data: {data_path}')
        try:
            df = load_data(data_path)
            print('Data shape:', df.shape)
            if not schema:
                schema = infer_schema(df)
            print('Schema:', schema)
            model = train_tabular_model(df, schema)
        except Exception as e:
            print(f'Error processing {data_path}:', e)

if __name__ == '__main__':
    main()
