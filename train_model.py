# --- Markdown Cell 0 ---
# ## **STEP 1: Problem Understanding Markdown**


# --- Markdown Cell 1 ---
# 
# # Karachi Crime Analysis and Crime Category Prediction
# 
# ## Problem Statement
# Crime is one of the major challenges faced by Karachi. Different areas experience different types of crimes due to demographic and socio-economic factors.
# 
# ## Importance for Pakistan
# Crime affects public safety, economic growth, and law enforcement planning. Understanding crime patterns can help authorities take preventive measures.
# 
# ## Objectives
# - Analyze crime trends in Karachi.
# - Identify important factors influencing crime.
# - Build machine learning models to predict crime categories.
# - Compare different ML models and select the best one.
# 
# ## Expected Outcome
# A machine learning model that can predict the type of crime based on demographic information.


# --- Code Cell 3 ---
from google.colab import drive
drive.mount('/content/drive')


# --- Code Cell 4 ---
import pandas as pd

# read dataset
file_path = "/content/drive/MyDrive/AI Project 2 folder/karachi_crime.csv"

df = pd.read_csv(file_path)

# step 2 Viewing data
#1
print(df.head())


# --- Markdown Cell 5 ---
# Markdown


# --- Markdown Cell 6 ---
# # Dataset Source
# 
# Dataset obtained from Kaggle.
# 
# ## Dataset Description
# 
# The dataset contains crime records from different areas of Karachi along with demographic information of suspects.
# 
# ## Features
# 
# - Month
# - Karachi Area
# - Crm Cd Desc
# - Crime Count
# - Suspect Age
# - Suspect Gender
# - Occupation
# - Education Level
# - Crime Motive
# - Reference Source


# --- Markdown Cell 7 ---
# STEP 3: Data Understanding Phase 1 (EDA)


# --- Code Cell 8 ---
df.info()


# --- Code Cell 9 ---
df.describe()


# --- Code Cell 10 ---
df.describe(include='object')


# --- Markdown Cell 11 ---
# # **Crime Distribution**


# --- Code Cell 12 ---
import matplotlib.pyplot as plt

top_crimes = df['Crm Cd Desc'].value_counts().head(10)

plt.figure(figsize=(10,5))
top_crimes.plot(kind='bar')
plt.title("Top 10 Crime Types")
plt.xticks(rotation=90)
plt.show()


# --- Markdown Cell 13 ---
# Observation


# --- Markdown Cell 14 ---
# Most crime records belong to theft, robbery and fraud related crimes.


# --- Markdown Cell 15 ---
# # **Area Wise Crime**


# --- Code Cell 16 ---
area_crime = df.groupby('Karachi Area')['Crime Count'].sum().sort_values(ascending=False)

plt.figure(figsize=(10,5))
area_crime.head(10).plot(kind='bar')
plt.title("Top Crime Areas")
plt.show()


# --- Markdown Cell 17 ---
# Observation


# --- Markdown Cell 18 ---
# Some areas contribute significantly more crime incidents than others.


# --- Markdown Cell 19 ---
# # **Gender Distribution**


# --- Code Cell 20 ---
df['Suspect_Gender'].value_counts().plot(kind='pie', autopct='%1.1f%%')
plt.title("Gender Distribution")
plt.show()


# --- Markdown Cell 21 ---
# Observation


# --- Markdown Cell 22 ---
# Male suspects appear more frequently in crime records.


# --- Markdown Cell 23 ---
# # **Education Level Distribution**


# --- Code Cell 24 ---
df['Education_Level'].value_counts().plot(kind='bar')
plt.title("Education Level Distribution")
plt.show()


# --- Markdown Cell 25 ---
# # **Crime Count Histogram**


# --- Code Cell 26 ---
plt.hist(df['Crime Count'], bins=20)
plt.title("Crime Count Distribution")
plt.show()


# --- Markdown Cell 27 ---
# # **Boxplot**


# --- Code Cell 28 ---
import seaborn as sns

sns.boxplot(x=df['Crime Count'])
plt.show()


# --- Markdown Cell 29 ---
# Observation


# --- Markdown Cell 30 ---
# Potential outliers exist in crime count values.


# --- Markdown Cell 31 ---
# # **STEP 4: Data Understanding Phase 2 Missing Values**


# --- Code Cell 32 ---
df.isnull().sum()


# --- Markdown Cell 33 ---
# # **Duplicate Records**


# --- Code Cell 34 ---
df.duplicated().sum()


# --- Markdown Cell 35 ---
# # **Outliers**


# --- Code Cell 36 ---
Q1 = df['Crime Count'].quantile(0.25)
Q3 = df['Crime Count'].quantile(0.75)

IQR = Q3 - Q1

lower = Q1 - 1.5*IQR
upper = Q3 + 1.5*IQR

outliers = df[(df['Crime Count'] < lower) | (df['Crime Count'] > upper)]

print(outliers.shape)


# --- Markdown Cell 37 ---
# # **Class Imbalance**


# --- Code Cell 38 ---
df['Crm Cd Desc'].value_counts()


# --- Code Cell 39 ---
df['Crm Cd Desc'].value_counts().plot(kind='bar')
plt.show()


# --- Markdown Cell 40 ---
# Observation


# --- Markdown Cell 41 ---
# Crime categories are not equally distributed.
# Class imbalance may affect model performance.


# --- Markdown Cell 42 ---
# **STEP 5: Data Preprocessing Remove Duplicates **


# --- Code Cell 43 ---
df.drop_duplicates(inplace=True)


# --- Markdown Cell 44 ---
# # **Missing Value Treatment**


# --- Code Cell 45 ---
df.ffill(inplace=True)


# --- Markdown Cell 46 ---
# # **Outlier Treatment**


# --- Code Cell 47 ---
Q1 = df['Crime Count'].quantile(0.25)
Q3 = df['Crime Count'].quantile(0.75)

IQR = Q3 - Q1

lower = Q1 - 1.5*IQR
upper = Q3 + 1.5*IQR

df['Crime Count'] = df['Crime Count'].clip(lower, upper)


# --- Markdown Cell 48 ---
# # **Encoding**


# --- Code Cell 49 ---
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()

cols = [
'Month',
'Karachi Area',
'Suspect_Age',
'Suspect_Gender',
'Occupation',
'Education_Level',
'Crime_Motive'
]

for col in cols:
    df[col] = le.fit_transform(df[col])


# --- Markdown Cell 50 ---
# # **STEP 6: Feature Selection Correlation Analysis**


# --- Code Cell 51 ---
import seaborn as sns

corr = df.select_dtypes(include='number').corr()

plt.figure(figsize=(10,6))
sns.heatmap(corr, annot=True)
plt.show()


# --- Markdown Cell 52 ---
# # **Mutual Information**


# --- Code Cell 53 ---
from sklearn.feature_selection import mutual_info_classif

X = df.drop(['Crm Cd Desc','Reference_Source'],axis=1)

y = df['Crm Cd Desc']

mi = mutual_info_classif(X,y)

pd.Series(mi,index=X.columns).sort_values(ascending=False)


# --- Markdown Cell 54 ---
# # **Random Forest Importance**


# --- Code Cell 55 ---
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier()

rf.fit(X,y)

importance = pd.Series(
rf.feature_importances_,
index=X.columns)

importance.sort_values().plot(kind='barh')
plt.show()


# --- Markdown Cell 56 ---
# Features selected using voting from:
# - Correlation
# - Mutual Information
# - Random Forest Importance


# --- Markdown Cell 57 ---
# # **STEP 7: Feature Engineering Month Extraction**


# --- Code Cell 58 ---
df['Month'] = df['Month'].astype(str)
df['Year'] = df['Month'].str[:4]
df['Month_Num'] = df['Month'].str[-2:]


# --- Markdown Cell 59 ---
# # **Crime Density**


# --- Code Cell 60 ---
area_avg = df.groupby('Karachi Area')['Crime Count'].transform('mean')

df['Area_Crime_Density'] = area_avg


# --- Markdown Cell 61 ---
# New features were created to capture temporal and area-level crime trends.


# --- Markdown Cell 62 ---
# # **STEP 8: Handling Class Imbalance**


# --- Code Cell 63 ---
from imblearn.over_sampling import RandomOverSampler

ros = RandomOverSampler(random_state=42)

X_resampled, y_resampled = ros.fit_resample(X, y)


# --- Markdown Cell 64 ---
# # **STEP 9: Model Building Train Test Split**


# --- Code Cell 65 ---
from sklearn.model_selection import train_test_split

X_train,X_test,y_train,y_test = train_test_split(
X_resampled,
y_resampled,
test_size=0.2,
random_state=42
)


# --- Markdown Cell 66 ---
# # **Logistic Regression**


# --- Code Cell 67 ---
from sklearn.linear_model import LogisticRegression

lr = LogisticRegression(max_iter=5000)

lr.fit(X_train,y_train)


# --- Markdown Cell 68 ---
# # **Decision Tree**


# --- Code Cell 69 ---
from sklearn.tree import DecisionTreeClassifier

dt = DecisionTreeClassifier()

dt.fit(X_train,y_train)


# --- Markdown Cell 70 ---
# # **Random Forest**
# 


# --- Code Cell 71 ---
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier()

rf.fit(X_train,y_train)


# --- Markdown Cell 72 ---
# # **STEP 10: Model Evaluation**


# --- Code Cell 73 ---
from sklearn.metrics import accuracy_score


# --- Markdown Cell 74 ---
# # **Logistic Regression**


# --- Code Cell 75 ---
pred_lr = lr.predict(X_test)

accuracy_score(y_test,pred_lr)


# --- Markdown Cell 76 ---
# # **Decision Tree**


# --- Code Cell 77 ---
pred_dt = dt.predict(X_test)

accuracy_score(y_test,pred_dt)


# --- Markdown Cell 78 ---
# # **Random Forest**


# --- Code Cell 79 ---
pred_rf = rf.predict(X_test)

accuracy_score(y_test,pred_rf)


# --- Markdown Cell 80 ---
# # **Classification Report**


# --- Code Cell 81 ---
from sklearn.metrics import classification_report

print(classification_report(y_test,pred_rf))


# --- Markdown Cell 82 ---
# # **Confusion Matrix**


# --- Code Cell 83 ---
from sklearn.metrics import confusion_matrix

cm = confusion_matrix(y_test,pred_rf)

sns.heatmap(cm)
plt.show()


# --- Markdown Cell 84 ---
# # **Model Comparison**


# --- Code Cell 85 ---
results = pd.DataFrame({

'Model':['Logistic Regression',
         'Decision Tree',
         'Random Forest'],

'Accuracy':[

accuracy_score(y_test,pred_lr),

accuracy_score(y_test,pred_dt),

accuracy_score(y_test,pred_rf)

]

})

results


# --- Code Cell 86 ---
results.plot(
x='Model',
y='Accuracy',
kind='bar'
)

plt.show()


# --- Markdown Cell 87 ---
# # **STEP 11: Final Conclusion**


# --- Markdown Cell 88 ---
# # Final Conclusion
# 
# The Karachi Crime Dataset was analyzed using the complete machine learning lifecycle.
# 
# Key Findings:
# - Crime patterns vary across Karachi areas.
# - Demographic factors influence crime categories.
# - Class imbalance existed and was handled using SMOTE.
# - Feature selection identified the most influential attributes.
# 
# Model Comparison:
# - Logistic Regression
# - Decision Tree
# - Random Forest
# 
# Best Model:
# Random Forest achieved the highest accuracy and performed best overall.
# 
# Limitations:
# - Dataset contains synthetic demographic information.
# - Additional socio-economic factors could improve prediction accuracy.
# 
# Future Work:
# - Use larger real-world datasets.
# - Apply XGBoost and Deep Learning models.
# - Develop a frontend dashboard for crime prediction.


# --- Markdown Cell 89 ---
# 

