<div align="center">

# Crime IQ - Karachi Crime Analysis ML Model

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?lines=Karachi+Crime+Analysis+ML+Model;Predictive+Crime+Mapping;Data-Driven+Public+Safety;AI-Powered+Insights&center=true&width=520&height=45">
</p>

*Machine Learning-Powered Crime Predictive Analysis Platform*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-Framework-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[![Last Commit](https://img.shields.io/github/last-commit/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model?style=for-the-badge&color=f39c12)](https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model/commits/main)
[![Repo Size](https://img.shields.io/github/repo-size/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model?style=for-the-badge&color=3498db)](https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model)
[![Stars](https://img.shields.io/github/stars/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model?style=for-the-badge&color=9b59b6)](https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model/stargazers)
[![Contributors](https://img.shields.io/github/contributors/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model?style=for-the-badge&color=1abc9c)](https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model?style=for-the-badge&logo=github&color=red)
[![License](https://img.shields.io/badge/License-AGPLv3.0-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&color=success)](https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model)

</div>

---

![Project Preview](./preview.jpeg)

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [⭐ Repository Visitors](#-repository-visitors)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [📁 Project Structure](#-project-structure)
- [📖 API Documentation](#-api-documentation)
- [🗺️ Available Nodes](#️-available-nodes)
- [🔐 Security Notes](#-security-notes)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)
- [❤️ Made with Love](#️-made-with-love)

---

## About The Project

**CrimeIQ** is an end-to-end crime analytics and prediction platform developed to assist researchers, law enforcement agencies, and public safety analysts in understanding crime trends within Karachi, Pakistan. 

Using historical crime records combined with synthetic demographic information of suspects, the platform trains machine learning models to classify and predict the most probable crime category based on situational and demographic inputs.

### 🧠 Model Performance & Selection
We compared three different machine learning models using the complete ML lifecycle (data cleaning, scaling, handling class imbalances, and splitting):

1. **Random Forest Classifier** *(Best Performing)*: Achieved **~97.8% Accuracy** and **~95.6% Precision**. Excellent for modeling complex boundaries.
2. **Decision Tree Classifier**: Achieved **~95.2% Accuracy**. Highly explainable, but slightly more prone to variance.
3. **Logistic Regression**: Achieved **~70.4% Accuracy**. Serving as our baseline linear classifier.

---

## ⭐ Repository Visitors

Keep track of the number of analysts, developers, and researchers visiting and cloning this repository:

<div align="center">

![Views](https://api.visitorbadge.io/api/visitors?path=Blue-Rangoon.Karachi-Crime-Analysis-ML-Model&label=TOTAL%20VISITORS&labelColor=%230d117&countColor=%brightgreen&style=for-the-badge)
![Clones](https://img.shields.io/badge/TOTAL%20CLONES-120%2B-brightgreen?style=for-the-badge&logo=git)

</div>

---

## ✨ Features

- **🤖 Interactive Prediction Engine**: Input parameters like Karachi Area, suspect age, suspect gender, educational levels, and motives to test model predictions in real-time.
- **📈 Rich Analytics Dashboard**: View metrics cards, prediction histories, risk scoring indexes, and categorical predictions distribution.
- **📰 Live Karachi Crime News**: Interacts with the Currents API proxy to pull the latest headlines and articles concerning regional security.
- **💎 Glassmorphic User Interface**: Sleek, modern styling with dark mode gradients, interactive animations (via AOS), and responsive CSS grids.
- **🔐 User Access flows**: Included interactive Login and Sign Up interfaces for user account simulation.

---

## 🛠️ Tech Stack

Our platform is engineered using modern web technologies and a robust Python data stack:

[![Tech Stack](https://skillicons.dev/icons?i=python,flask,html,css,js,sklearn,bootstrap,git,vercel)](https://skillicons.dev)

- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Advanced custom stylesheets), Vanilla ES6 JavaScript
- **Backend**: Flask (Python web server)
- **Machine Learning**: Scikit-Learn, pandas, numpy, joblib, imbalanced-learn (RandomOverSampler)
- **Deployment**: Vercel Serverless Functions

---

## 🚀 Getting Started

Follow these steps to set up and run CrimeIQ locally on your system.

### Prerequisites

Ensure you have the following installed:
- [Python 3.8+](https://www.python.org/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Blue-Rangoon/Karachi-Crime-Analysis-ML-Model.git
   cd Karachi-Crime-Analysis-ML-Model
   ```

2. **Set Up a Virtual Environment** (Optional but recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in the root directory and add your Currents API Key to enable the live news module:
   ```env
   CURRENTS_KEY=your_api_key_here
   ```

### Running the Application

Start the Flask development server:
```bash
python app.py
```

> [!NOTE]
> On the first run, `app.py` detects if the large Random Forest model (`crime_model.joblib`, **~354MB**) is missing. It will automatically download the pre-trained model file from Google Drive using `gdown`. This might take a couple of minutes depending on your internet connection.

Once loaded, access the application in your browser at:
`http://127.0.0.1:5000`

---

## 📁 Project Structure

Here is the structural overview of the repository:

```text
Karachi-Crime-Analysis-ML-Model/
├── dataset/
│   └── karachi_crime.csv        # Local dataset
├── scripts/
│   ├── index.js                 # Authentication & UI controls
│   └── dashboard.js             # Prediction logic & charts visualization
├── styles/
│   ├── index.css                # Base styling & landing page design
│   └── dashboard.css            # Dashboard layouts & card component designs
├── app.py                       # Main Flask web API routing & server
├── train_model.py               # Comprehensive training notebook conversion
├── train_and_save_model.py      # Core data preparation & model generation script
├── vercel.json                  # Deployment serverless configuration
├── requirements.txt             # Required Python libraries list
├── LICENSE                      # MIT License file
├── index.html                   # Login & Landing page structure
└── dashboard.html               # Main analytics layout structure
```

---

## 📖 API Documentation

### 1. Get Categorical Feature Encodings
* **Route**: `/api/features`
* **Method**: `GET`
* **Description**: Returns lists of encoded categorical labels accepted by models. Used to populate select inputs on frontend dynamically.
* **Success Response (200 OK)**:
  ```json
  {
    "Karachi Area": ["Gulshan-e-Iqbal", "Saddar", "Clifton", "Korangi", "..."],
    "Suspect_Gender": ["Male", "Female", "Unknown"],
    "Crime_Motive": ["Financial Gain", "Personal Enmity", "Drug Addiction", "..."]
  }
  ```

### 2. Predict Crime Category
* **Route**: `/api/predict`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Payload**:
  ```json
  {
    "Model": "Random Forest",
    "Month": "January",
    "Karachi Area": "Saddar",
    "Crime Count": 1.0,
    "Suspect_Age": "21-30",
    "Suspect_Gender": "Male",
    "Occupation": "Unemployed",
    "Education_Level": "Undergraduate",
    "Crime_Motive": "Financial Gain"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "prediction": "ROBBERY",
    "confidence": 98.4,
    "risk_score": 98,
    "risk_level": "High",
    "top_predictions": [
      {"category": "ROBBERY", "probability": 0.984},
      {"category": "THEFT", "probability": 0.016}
    ],
    "model_name": "Random Forest",
    "accuracy": 0.978,
    "precision": 0.956
  }
  ```

### 3. Retrieve Crime News
* **Route**: `/api/news`
* **Method**: `GET`
* **Description**: Contacts Currents API and returns the top 10 articles matching keywords "Karachi crime".

---

## 🗺️ Available Nodes

Below is the collection of interactive interfaces and routes accessible within the system:

- 🏠 **`/` (index.html)**: The landing page containing feature breakdowns, pricing metrics, project details, and auth modal triggers (Login / Sign Up).
- 📊 **`/dashboard.html`**: The main user hub containing live crime analytics charts, predictions entry forms, risk indicators, and real-time news feeds.
- ⚙️ **`/api/features`**: Fetches categories metadata.
- 🔮 **`/api/predict`**: Sends configuration variables to models to retrieve predictions.
- 📰 **`/api/news`**: News proxy endpoint.

---

## 🔐 Security Notes

- **API Keys**: Ensure your `CURRENTS_KEY` token is stored in the `.env` file. Never commit `.env` configurations to public repositories.
- **CORS Handling**: `app.py` implements CORS headers globally using `@app.after_request` to permit requests across developer sub-environments. Be sure to narrow this configuration down for strict production environments.
- **Robust Model Fallbacks**: If a categorical input value is sent that was not present during model encoder fitting, the backend safe-handles it by substituting `Unknown` or selecting the default fallback category.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the AGPL-3.0 License. See [LICENSE](LICENSE) for more information.

---

## 👥 Team

Meet the core developers behind CrimeIQ:

<div align="center">
  
  <!-- Row 1: 3 Members -->
  <table align="center">
    <tr>
      <!-- Sadia Shoaib -->
      <td align="center" width="220" style="border: 1px solid #30363d; border-radius: 10px; background-color: #0d1117; padding: 15px; vertical-align: top;">
        <a href="https://github.com/Sadia-Shoaib">
          <img src="https://github.com/Sadia-Shoaib.png" width="90" style="border-radius: 50%; border: 3px solid #58a6ff;" alt="Sadia Shoaib Avatar"/>
          <br /><br />
          <font size="3" color="#58a6ff"><b>Sadia Shoaib</b></font>
        </a>
        <br />
        <font size="2" color="#8b949e">Lead ML Architect & Developer</font>
        <br /><br />
        <a href="https://github.com/Sadia-Shoaib">
          <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
        </a>
        <a href="https://www.linkedin.com/in/sadia-shoaib-/">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
        </a>
      </td>
      <!-- Saad Ali Rizvi -->
      <td align="center" width="220" style="border: 1px solid #30363d; border-radius: 10px; background-color: #0d1117; padding: 15px; vertical-align: top;">
        <a href="https://github.com/Blue-Rangoon">
          <img src="https://github.com/Blue-Rangoon.png" width="90" style="border-radius: 50%; border: 3px solid #58a6ff;" alt="Saad Ali Rizvi Avatar"/>
          <br /><br />
          <font size="3" color="#58a6ff"><b>Saad Ali Rizvi</b></font>
        </a>
        <br />
        <font size="2" color="#8b949e">Frontend Developer</font>
        <br /><br />
        <a href="https://github.com/Blue-Rangoon">
          <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
        </a>
        <a href="https://linkedin.com/saad-ali-rizvi">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
        </a>
      </td>
      <!-- Laiba Idrees -->
      <td align="center" width="220" style="border: 1px solid #30363d; border-radius: 10px; background-color: #0d1117; padding: 15px; vertical-align: top;">
        <a href="https://github.com/laiba7826">
          <img src="https://github.com/laiba7826.png" width="90" style="border-radius: 50%; border: 3px solid #58a6ff;" alt="Laiba Idrees Avatar"/>
          <br /><br />
          <font size="3" color="#58a6ff"><b>Laiba Idrees</b></font>
        </a>
        <br />
        <font size="2" color="#8b949e">Backend Engineer</font>
        <br /><br />
        <a href="https://github.com/laiba7826">
          <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
        </a>
        <a href="https://www.linkedin.com/in/laiba-idrees-a14758319">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
        </a>
      </td>
    </tr>
  </table>
  
  <br />

  <!-- Row 2: 2 Members -->
  <table align="center">
    <tr>
      <!-- Syed Anas Hasan -->
      <td align="center" width="220" style="border: 1px solid #30363d; border-radius: 10px; background-color: #0d1117; padding: 15px; vertical-align: top;">
        <a href="https://github.com/Syed-Anas-Hasan">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJBcfu964JaBPwAWn-M5nBZHIB91oSmxkfwXOVBzOvtW1l30DlBGyvC0&s=10" width="90" style="border-radius: 50%; border: 3px solid #58a6ff;" alt="Syed Anas Hasan Avatar"/>
          <br /><br />
          <font size="3" color="#58a6ff"><b>Syed Anas Hasan</b></font>
        </a>
        <br />
        <font size="2" color="#8b949e">Integration & Technical Specialist</font>
        <br /><br />
        <a href="https://github.com/Syed-Anas-Hasan">
          <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
        </a>
        <a href="https://www.linkedin.com/in/anas19/">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
        </a>
      </td>
      <!-- Alishba Batool -->
      <td align="center" width="220" style="border: 1px solid #30363d; border-radius: 10px; background-color: #0d1117; padding: 15px; vertical-align: top;">
        <a href="https://github.com/Alishba87542">
          <img src="https://raw.githubusercontent.com/1l0/identicon/master/example/identicons/default.png" width="90" style="border-radius: 50%; border: 3px solid #58a6ff;" alt="Alishba Batool Avatar"/>
          <br /><br />
          <font size="3" color="#58a6ff"><b>Alishba Batool</b></font>
        </a>
        <br />
        <font size="2" color="#8b949e">Research & Documentation</font>
        <br /><br />
        <a href="https://github.com/Alishba87542">
          <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub Profile" />
        </a>
        <a href="https://www.linkedin.com/in/alishba-batool-12b851355/">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn Profile" />
        </a>
      </td>
    </tr>
  </table>

</div>

---

## ❤️ Made with Love

<div align="center">

*Built with passion by Student Development Team*

![Python](https://img.shields.io/badge/Made%20with-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Made%20with-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Love](https://img.shields.io/badge/Made%20with-❤️-FF6B6B?style=for-the-badge)

*© 2026 CrimeIQ - Karachi Crime Analysis & Prediction Portal. All rights reserved.*

</div>
