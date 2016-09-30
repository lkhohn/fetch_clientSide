#!/bin/bash
cordova build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /Users/lindsayhohn/fetch_clientSide/fetchApp/platforms/android/build/outputs/apk/fetch-release-key.keystore /Users/lindsayhohn/fetch_clientSide/fetchApp/platforms/android/build/outputs/apk/android-release-unsigned.apk fetch_alias
