
import os
import re
import sys
import subprocess
import pandas as pd
import numpy as np
from glob import glob
from datetime import datetime

# --- Auto-install required packages ---
def install(package):
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])

try:
    import matplotlib.pyplot as plt
    import seaborn as sns
except ImportError:
    install('matplotlib')
    install('seaborn')
    import matplotlib.pyplot as plt
    import seaborn as sns

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.metrics import classification_report
except ImportError:
    install('scikit-learn')
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.metrics import classification_report

try:
    import shap
except ImportError:
    install('shap')
    import shap

try:
    from mlxtend.frequent_patterns import apriori, association_rules
except ImportError:
    install('mlxtend')
    from mlxtend.frequent_patterns import apriori, association_rules

# --- 1. File Discovery ---
def find_files():
    files = glob('*.log') + glob('*.csv') + glob('*.parquet')
    return files

# --- 2. Log Parsing for Schema ---
def parse_log_for_schema(log_path):
    with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    pattern = r"SourceColumn\(id='[^']+', name='([^']+)', included=True, model_encoding_type=<ModelEncodingType.([a-zA-Z0-9_]+): '[^']+'>"
    matches = re.findall(pattern, text)
    schema = [(name, dtype) for name, dtype in matches]
    return schema

# --- 3. Data Loading ---
def load_data(path):
    if path.endswith('.csv'):
        return pd.read_csv(path)
    elif path.endswith('.parquet'):
        return pd.read_parquet(path)
    else:
        raise ValueError('Unsupported file type: ' + path)

# --- 4. Schema Inference ---
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

# --- 5. Automated EDA & Visualization ---
def automated_eda(df, out_prefix):
    profile = {}
    profile['shape'] = df.shape
    profile['columns'] = list(df.columns)
    profile['dtypes'] = df.dtypes.astype(str).to_dict()
    profile['missing'] = df.isnull().sum().to_dict()
    profile['describe'] = df.describe(include='all').to_dict()
    # Save profile
    pd.DataFrame([profile]).to_json(f'{out_prefix}_profile.json', orient='records', indent=2)
    # Visualizations
    for col in df.select_dtypes(include='number').columns:
        plt.figure()
        sns.histplot(df[col].dropna(), kde=True)
        plt.title(f'Distribution of {col}')
        plt.savefig(f'{out_prefix}_hist_{col}.png')
        plt.close()
    for col in df.select_dtypes(include='object').columns:
        plt.figure()
        df[col].value_counts().head(20).plot(kind='barh')
        plt.title(f'Top 20 {col}')
        plt.savefig(f'{out_prefix}_bar_{col}.png')
        plt.close()

# --- 6. Feature Engineering ---
def feature_engineering(df):
    # Symbolic: polynomial features, group stats, etc.
    df_fe = df.copy()
    num_cols = df_fe.select_dtypes(include='number').columns
    for col in num_cols:
        df_fe[f'{col}_squared'] = df_fe[col] ** 2
    # Group stats for categoricals
    cat_cols = df_fe.select_dtypes(include='object').columns
    for cat in cat_cols:
        for num in num_cols:
            grp = df_fe.groupby(cat)[num].transform('mean')
            df_fe[f'{cat}_{num}_mean'] = grp
    # Fill NA
    df_fe = df_fe.fillna(df_fe.median(numeric_only=True))
    return df_fe

# --- 7. Symbolic Rule Mining ---
def symbolic_rule_mining(df, out_prefix):
    # Only for small datasets with categoricals
    cat_cols = [c for c in df.columns if df[c].dtype == 'object' and df[c].nunique() < 20]
    if len(cat_cols) < 2:
        return
    # One-hot encode
    df_bin = pd.get_dummies(df[cat_cols])
    freq = apriori(df_bin, min_support=0.1, use_colnames=True)
    rules = association_rules(freq, metric='confidence', min_threshold=0.7)
    rules.to_csv(f'{out_prefix}_symbolic_rules.csv', index=False)

# --- 8. Outlier & Anomaly Detection ---
def detect_outliers(df, out_prefix):
    num_cols = df.select_dtypes(include='number').columns
    if len(num_cols) == 0:
        return
    zscores = (df[num_cols] - df[num_cols].mean()) / df[num_cols].std()
    outliers = (np.abs(zscores) > 3).any(axis=1)
    df_out = df[outliers]
    df_out.to_csv(f'{out_prefix}_outliers.csv', index=False)

# --- 9. Model Training & Explainability ---
def train_and_explain(df, schema, out_prefix):
    # Pick target
    cat_cols = [col for col, typ in schema if 'CATEGORICAL' in typ]
    num_cols = [col for col, typ in schema if 'NUMERIC' in typ]
    if not cat_cols:
        print('No categorical columns for target!')
        return
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
    # Scale
    X = pd.DataFrame(StandardScaler().fit_transform(X), columns=X.columns)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    acc = clf.score(X_test, y_test)
    print(f'Model accuracy (target={target}): {acc:.3f}')
    # Classification report
    with open(f'{out_prefix}_classification_report.txt', 'w') as f:
        f.write(classification_report(y_test, clf.predict(X_test)))
    # SHAP explainability
    explainer = shap.TreeExplainer(clf)
    shap_values = explainer.shap_values(X_test)
    plt.figure()
    shap.summary_plot(shap_values, X_test, show=False)
    plt.savefig(f'{out_prefix}_shap_summary.png')
    plt.close()
    # Feature importances
    feat_imp = pd.Series(clf.feature_importances_, index=X.columns).sort_values(ascending=False)
    feat_imp.to_csv(f'{out_prefix}_feature_importances.csv')
    plt.figure()
    feat_imp.head(20).plot(kind='barh')
    plt.title('Top 20 Feature Importances')
    plt.savefig(f'{out_prefix}_feat_imp.png')
    plt.close()

# --- 10. Main Pipeline ---
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
        out_prefix = os.path.splitext(data_path)[0]
        print(f'
Processing: {data_path}')
        try:
            df = load_data(data_path)
            print('Data shape:', df.shape)
            if not schema:
                schema = infer_schema(df)
            print('Schema:', schema)
            automated_eda(df, out_prefix)
            df_fe = feature_engineering(df)
            symbolic_rule_mining(df, out_prefix)
            detect_outliers(df, out_prefix)
            train_and_explain(df_fe, schema, out_prefix)
        except Exception as e:
            print(f'Error processing {data_path}:', e)

if __name__ == '__main__':
    main()
