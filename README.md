
# react-native-toolbox

## Getting started

`$ npm install react-native-toolbox --save`

### Mostly automatic installation

`$ react-native link react-native-toolbox`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-toolbox` and add `RNToolbox.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNToolbox.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNToolboxPackage;` to the imports at the top of the file
  - Add `new RNToolboxPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-toolbox'
  	project(':react-native-toolbox').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-toolbox/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-toolbox')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNToolbox.sln` in `node_modules/react-native-toolbox/windows/RNToolbox.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Toolbox.RNToolbox;` to the usings at the top of the file
  - Add `new RNToolboxPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNToolbox from 'react-native-toolbox';

// TODO: What to do with the module?
RNToolbox;
```
  