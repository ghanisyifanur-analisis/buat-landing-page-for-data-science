"""
Automated Model QA & Invariant Test Suite for Data Science Continuous Deployment (CD).
Enforces behavioral testing, robustness, latency SLAs, and non-determinism bounds.
"""
import time
import pytest
import numpy as np


class MockMLModel:
    """Simulated production machine learning model."""
    def __init__(self):
        self.version = "2.4.1"
        self.expected_features = 8
        self.weights = np.array([0.15, -0.22, 0.45, 0.08, -0.31, 0.19, 0.52, -0.05])
        self.bias = 0.05

    def predict(self, features: np.ndarray) -> np.ndarray:
        if features.ndim == 1:
            features = features.reshape(1, -1)
        if features.shape[1] != self.expected_features:
            raise ValueError(f"Feature dimension mismatch: got {features.shape[1]}, expected {self.expected_features}")
        # Sigmoid activation
        z = np.dot(features, self.weights) + self.bias
        return 1.0 / (1.0 + np.exp(-z))


@pytest.fixture
def model():
    return MockMLModel()


def test_model_initialization(model):
    """Verify model can be loaded with correct parameters and version."""
    assert model.version is not None
    assert model.expected_features == 8


def test_model_output_range(model):
    """Ensure predicted probabilities strictly fall between 0.0 and 1.0."""
    np.random.seed(42)
    sample_inputs = np.random.randn(100, 8)
    predictions = model.predict(sample_inputs)
    assert np.all(predictions >= 0.0), "Found negative predictions"
    assert np.all(predictions <= 1.0), "Found predictions exceeding 1.0"


def test_model_deterministic_predictions(model):
    """Guarantee that the same input features always yield identical predictions."""
    sample = np.array([[1.2, -0.5, 0.0, 3.4, -1.1, 0.8, -0.2, 0.4]])
    pred1 = model.predict(sample)
    pred2 = model.predict(sample)
    assert np.isclose(pred1, pred2, atol=1e-7), "Model predictions are non-deterministic"


def test_model_inference_latency_sla(model):
    """Ensure p99 inference latency meets SLA (< 30ms per batch of 50)."""
    batch = np.random.randn(50, 8)
    latencies = []
    # Warmup
    _ = model.predict(batch)

    for _ in range(50):
        t0 = time.perf_counter()
        _ = model.predict(batch)
        latencies.append((time.perf_counter() - t0) * 1000)

    p99 = np.percentile(latencies, 99)
    assert p99 < 30.0, f"p99 latency {p99:.2f}ms violates SLA limit (30ms)"


def test_model_handles_invalid_feature_dimension(model):
    """Ensure model raises a descriptive error when feature vector length is wrong."""
    invalid_batch = np.random.randn(5, 4)  # 4 features instead of 8
    with pytest.raises(ValueError, match="Feature dimension mismatch"):
        model.predict(invalid_batch)


def test_model_invariance_to_small_epsilon(model):
    """Adversarial check: small jitter (noise epsilon) must not flip prediction drastically."""
    base_input = np.array([[0.5, 0.2, 0.1, -0.4, 0.3, 0.0, 0.2, -0.1]])
    noise = np.random.normal(0, 0.005, size=base_input.shape)
    
    pred_base = model.predict(base_input)
    pred_noisy = model.predict(base_input + noise)
    
    difference = np.abs(pred_base - pred_noisy)
    assert difference < 0.05, f"Model excessively sensitive to minimal noise: diff={difference}"
