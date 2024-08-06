# Сборка

## Web

```
npx webpack --mode [mode] --env platform=[platform]
yarn webpack --mode [mode] --env platform=[platform]
```

mode = development, production (default = development) \
platform = web, tizen, webos, vidaa (default = web)

## Android

```
npx react-native-tvos build-android
yarn react-native-tvos build-android
```

## IOS

Подготовка

```
cd ios
bundle install
OS=[os] bundle exec pod install
```

OS = ios, tvos

Для смены платформы преварительно запустить

```
pod deintegrate
rm -rf build/ Podfile.lock
```

Сборка

```
npx react-native-tvos build-ios
yarn react-native-tvos build-ios
```
