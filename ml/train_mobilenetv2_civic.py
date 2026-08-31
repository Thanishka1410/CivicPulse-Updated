"""
CivicPulse ML Pipeline - MobileNetV2 Transfer Learning Script
--------------------------------------------------------------
This script demonstrates how to fine-tune MobileNetV2 on a custom dataset of civic issue images
(Potholes, Garbage, Street Light, Traffic Light, Water Supply, Sewerage, Electricity Issue)
and export the model to TensorFlow.js format for web deployment.

Requirements:
    pip install tensorflow tensorflowjs pillow matplotlib
"""

import os
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 1. Dataset Configuration
DATASET_DIR = './dataset' # Directory structure: dataset/{Potholes, Garbage, StreetLight, TrafficLight, WaterSupply, Sewerage, Electricity}
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15
NUM_CLASSES = 8

def train_custom_mobilenetv2():
    print("🚀 Initializing MobileNetV2 Transfer Learning Pipeline for CivicPulse...")

    # Data Augmentation for robust field photo handling
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    if not os.path.exists(DATASET_DIR):
        print(f"⚠️ Dataset directory '{DATASET_DIR}' not found. Create dataset folders with civic images to train custom weights.")
        return

    train_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    val_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # 2. Base Model: MobileNetV2 with pre-trained ImageNet weights (without top classification head)
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False  # Freeze base layers for transfer learning

    # 3. Custom Classification Head for Civic Categories
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(NUM_CLASSES, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    # 4. Compile Model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    # 5. Fine-Tuning Phase 1
    print("\n⚡ Training Top Custom Layers...")
    model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS
    )

    # 6. Fine-Tuning Phase 2: Unfreeze top layers of MobileNetV2 for higher domain accuracy
    base_model.trainable = True
    for layer in base_model.layers[:100]:
        layer.trainable = False  # Keep early feature extractors frozen

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("\n🎯 Fine-Tuning Deep MobileNetV2 Layers...")
    model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=10
    )

    # 7. Save Keras H5 Model
    os.makedirs('./output', exist_ok=True)
    h5_path = './output/civicpulse_mobilenetv2.h5'
    model.save(h5_path)
    print(f"✅ Model saved to {h5_path}")

    # 8. Convert to TensorFlow.js Web Model
    print("\n📦 Converting to TensorFlow.js format for web browser inference...")
    tfjs_output_dir = '../frontend/public/model'
    os.system(f"tensorflowjs_converter --input_format=keras {h5_path} {tfjs_output_dir}")
    print(f"🎉 TensorFlow.js model files exported to {tfjs_output_dir}/model.json")

if __name__ == '__main__':
    train_custom_mobilenetv2()
