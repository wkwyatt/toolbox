
package com.reactlibrary;

import android.hardware.fingerprint.FingerprintManager
import android.os.Build

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNToolboxModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNToolboxModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNToolbox";
  }

  @ReactMethod
  public void isAvailable(final Promise promise) {
    try {
      FingerprintManager manager = getFingerprintManager();
      boolean v = (manager != null && manager.isHardwareDetected() && manager.hasEnrolledFingerprints());
      promise.resolve(v);
    } catch (Exception ex) {
      promise.reject("ERR_UNEXPECTED_EXCEPTION", ex);
    }
  }

  @ReactMethod
  private FingerprintManager getFingerprintManager() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      return (FingerprintManager) reactContext.getSystemService(reactContext.FINGERPRINT_SERVICE);
    } else {
      return null;
    }
  }
}