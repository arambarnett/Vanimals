# 3D Model Assets for Vanimals AR

This directory contains 3D model files for AR functionality.

## Available Models ✅

The following 3D model files are ready for AR:

- `pigeon.glb` - 3D model for pigeon vanimal (83KB)
- `elephant.glb` - 3D model for elephant vanimal (281KB)
- `tiger.glb` - 3D model for tiger vanimal (152KB)
- `penguin.glb` - 3D model for penguin vanimal (61KB)
- `axolotl.glb` - 3D model for axolotl vanimal (149KB)
- `chimpanzee.glb` - 3D model for chimpanzee vanimal (257KB)

## Model Requirements

- Format: GLTF 2.0 (.gltf or .glb)
- Size: Recommended < 5MB per model
- Optimization: Models should be optimized for mobile AR
- Textures: Include all required texture files
- Scale: Models should be designed for real-world scale (approx 0.1-0.5 meters)

## Sources for 3D Models

You can obtain 3D models from:
- [Sketchfab](https://sketchfab.com/) (free and paid models)
- [Google Poly](https://poly.google.com/) (deprecated but archived models available)
- [Mixamo](https://www.mixamo.com/) (Adobe, free animated models)
- Create custom models in Blender, Maya, or other 3D software

## Integration ✅

The models are fully integrated:
1. ✅ `pubspec.yaml` includes the models in assets
2. ✅ File paths in `ar_controller.dart` match the model filenames
3. 🚀 Ready to test AR functionality on physical device (AR requires camera)

## Notes

- AR functionality requires a physical device with camera
- iOS devices need ARKit support
- Android devices need ARCore support
- Models may need texture files (.jpg, .png) in the same directory