
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, mean_squared_error
import xgboost as xgb
import joblib

# Load your full dataset here
full_path = 'deepcal_enriched_full.csv'  # Update with your actual file path
df = pd.read_csv(full_path)

# --- Feature Engineering ---
for col in ['destination_country', 'carrier', 'route', 'carrier_dest']:
    df[col] = df[col].astype('category').cat.codes
for col in ['weight_kg', 'volume_cbm', 'days_to_dispatch', 'days_to_greenlight', 'vol_weight_ratio']:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

features = [
    'destination_country', 'carrier', 'weight_kg', 'volume_cbm',
    'days_to_dispatch', 'days_to_greenlight', 'vol_weight_ratio',
    'carrier_dest', 'anomaly_negative_dispatch', 'anomaly_negative_greenlight',
    'anomaly_extreme_weight', 'anomaly_extreme_volume', 'anomaly_extreme_ratio'
]

# Classification: Predict loss_of_life
X_cls = df[features]
y_cls = df['loss_of_life']

# Regression: Predict days_to_dispatch, weight_kg
X_reg = df[features]
y_reg_time = df['days_to_dispatch']
y_reg_cost = df['weight_kg']

# Train/test split
Xc_train, Xc_test, yc_train, yc_test = train_test_split(X_cls, y_cls, test_size=0.2, random_state=42, stratify=y_cls)
Xr_train, Xr_test, yr_train, yr_test = train_test_split(X_reg, y_reg_time, test_size=0.2, random_state=42)
Xw_train, Xw_test, yw_train, yw_test = train_test_split(X_reg, y_reg_cost, test_size=0.2, random_state=42)

# --- XGBoost Classification ---
cls_model = xgb.XGBClassifier(n_estimators=200, scale_pos_weight=(len(yc_train)-yc_train.sum())/yc_train.sum() if yc_train.sum() > 0 else 1, n_jobs=-1, use_label_encoder=False, eval_metric='logloss')
cls_model.fit(Xc_train, yc_train)
cls_pred = cls_model.predict(Xc_test)
cls_proba = cls_model.predict_proba(Xc_test)[:,1]
cls_report = classification_report(yc_test, cls_pred)
try:
    cls_auc = roc_auc_score(yc_test, cls_proba)
except:
    cls_auc = 'undefined (only one class present)'

# --- XGBoost Regression (Time) ---
reg_time_model = xgb.XGBRegressor(n_estimators=200, n_jobs=-1)
reg_time_model.fit(Xr_train, yr_train)
reg_time_pred = reg_time_model.predict(Xr_test)
reg_time_rmse = np.sqrt(mean_squared_error(yr_test, reg_time_pred))

# --- XGBoost Regression (Cost) ---
reg_cost_model = xgb.XGBRegressor(n_estimators=200, n_jobs=-1)
reg_cost_model.fit(Xw_train, yw_train)
reg_cost_pred = reg_cost_model.predict(Xw_test)
reg_cost_rmse = np.sqrt(mean_squared_error(yw_test, reg_cost_pred))

# Save models
joblib.dump(cls_model, 'deepcal_xgb_loss_of_life.pkl')
joblib.dump(reg_time_model, 'deepcal_xgb_days_to_dispatch.pkl')
joblib.dump(reg_cost_model, 'deepcal_xgb_weight_kg.pkl')

# Save reports
with open('deepcal_xgb_classification_report.txt', 'w') as f:
    f.write(cls_report + f"
AUC: {cls_auc}")
with open('deepcal_xgb_regression_report.txt', 'w') as f:
    f.write(f"Days to Dispatch RMSE: {reg_time_rmse:.2f}
Weight KG RMSE: {reg_cost_rmse:.2f}")

print('Training complete. Models and reports saved.')
