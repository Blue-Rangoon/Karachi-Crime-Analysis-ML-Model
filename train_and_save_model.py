import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from imblearn.over_sampling import RandomOverSampler
import joblib
import os

def main():
    # Define paths
    dataset_path = os.path.join("dataset", "karachi_crime.csv")
    
    print(f"Loading dataset from: {dataset_path}...")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)

    print("Preprocessing data...")
    # Remove duplicates
    df.drop_duplicates(inplace=True)

    # Forward fill missing values
    df.ffill(inplace=True)

    # Outlier treatment on Crime Count
    Q1 = df['Crime Count'].quantile(0.25)
    Q3 = df['Crime Count'].quantile(0.75)
    IQR = Q3 - Q1
    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR
    df['Crime Count'] = df['Crime Count'].clip(lower, upper)

    # Encode categorical columns separately
    cols_to_encode = [
        'Month',
        'Karachi Area',
        'Suspect_Age',
        'Suspect_Gender',
        'Occupation',
        'Education_Level',
        'Crime_Motive'
    ]

    print("Fitting label encoders...")
    encoders = {}
    for col in cols_to_encode:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    # Features and Target
    X = df.drop(['Crm Cd Desc', 'Reference_Source'], axis=1)
    y = df['Crm Cd Desc'].astype(str)

    # Handle class imbalance
    print("Handling class imbalance using RandomOverSampler...")
    ros = RandomOverSampler(random_state=42)
    X_resampled, y_resampled = ros.fit_resample(X, y)

    # Train/Test Split
    print("Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X_resampled,
        y_resampled,
        test_size=0.2,
        random_state=42
    )

    # 1. Train Logistic Regression
    print("Training Logistic Regression...")
    lr = LogisticRegression(max_iter=5000, random_state=42)
    lr.fit(X_train, y_train)
    acc_lr = accuracy_score(y_test, lr.predict(X_test))
    print(f"Logistic Regression Accuracy: {acc_lr:.4f}")
    joblib.dump(lr, "logistic_model.joblib")

    # 2. Train Decision Tree
    print("Training Decision Tree...")
    dt = DecisionTreeClassifier(random_state=42)
    dt.fit(X_train, y_train)
    acc_dt = accuracy_score(y_test, dt.predict(X_test))
    print(f"Decision Tree Accuracy: {acc_dt:.4f}")
    joblib.dump(dt, "decision_tree_model.joblib")

    # 3. Train Random Forest
    print("Training Random Forest...")
    rf = RandomForestClassifier(random_state=42, n_estimators=100)
    rf.fit(X_train, y_train)
    acc_rf = accuracy_score(y_test, rf.predict(X_test))
    print(f"Random Forest Accuracy: {acc_rf:.4f}")
    joblib.dump(rf, "random_forest_model.joblib")

    # Save Encoders
    print("Saving encoders...")
    joblib.dump(encoders, "model_encoders.joblib")

    print("Success! All models and encoders saved.")

if __name__ == "__main__":
    main()
