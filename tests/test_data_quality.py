"""
Data Quality & Schema Invariant Tests (Great Expectations style)
Verifies data pipeline inputs before retraining or batch inference.
"""
import pytest
import numpy as np
import pandas as pd


@pytest.fixture
def sample_dataset():
    """Generates standard clean dataframe for batch ingestion testing."""
    np.random.seed(42)
    n = 200
    df = pd.DataFrame({
        "customer_id": [f"CUST_{i:05d}" for i in range(n)],
        "age": np.random.randint(18, 75, size=n),
        "income": np.random.exponential(scale=50000, size=n) + 15000,
        "transaction_count_30d": np.random.poisson(lam=12, size=n),
        "risk_score": np.random.uniform(0.0, 1.0, size=n),
        "country_code": np.random.choice(["ID", "SG", "MY", "PH"], size=n)
    })
    return df


def test_schema_column_presence(sample_dataset):
    """Verify all mandatory features exist in incoming data feed."""
    expected_columns = {"customer_id", "age", "income", "transaction_count_30d", "risk_score", "country_code"}
    missing = expected_columns - set(sample_dataset.columns)
    assert not missing, f"Missing critical pipeline columns: {missing}"


def test_no_null_values_in_primary_keys(sample_dataset):
    """Verify customer_id has 0% null and unique IDs."""
    assert sample_dataset["customer_id"].isnull().sum() == 0, "Null IDs detected"
    assert sample_dataset["customer_id"].is_unique, "Duplicate customer IDs detected"


def test_numerical_value_ranges(sample_dataset):
    """Verify age and income boundaries conform to business reality."""
    assert (sample_dataset["age"] >= 18).all(), "Underage record found"
    assert (sample_dataset["age"] <= 120).all(), "Invalid high age found"
    assert (sample_dataset["income"] >= 0).all(), "Negative income detected"
    assert (sample_dataset["risk_score"].between(0.0, 1.0)).all(), "Risk score out of [0, 1] range"


def test_categorical_allowed_values(sample_dataset):
    """Ensure categorical fields do not contain unexpected injected strings."""
    allowed_countries = {"ID", "SG", "MY", "PH", "TH", "VN"}
    actual_countries = set(sample_dataset["country_code"].unique())
    invalid = actual_countries - allowed_countries
    assert not invalid, f"Unrecognized categorical values: {invalid}"
