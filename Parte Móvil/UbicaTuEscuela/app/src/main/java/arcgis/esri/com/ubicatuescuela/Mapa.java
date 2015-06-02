package arcgis.esri.com.ubicatuescuela;

import android.app.Activity;
import android.os.Build;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.ConsoleMessage;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class Mapa extends ActionBarActivity implements GeolocationPermissions.Callback{

    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mapa);
        getSupportActionBar().hide();

        mWebView = (WebView) findViewById(R.id.webView);

        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.getSettings().setBuiltInZoomControls(true);
        mWebView.getSettings().setGeolocationEnabled(true);

        //GeolocationPermissions geoPerm = new GeolocationPermissions();
        MyWebChromeClient mWCC = new MyWebChromeClient();
        mWebView.setWebChromeClient(mWCC);

        mWebView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, String url){
                // do your handling codes here, which url is the requested url
                // probably you need to open that url rather than redirect:
                view.loadUrl(url);
                return false; // then it is not handled by default action
            }
        });

        //habilitar Flash
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.FROYO){
            mWebView.getSettings().setPluginState(WebSettings.PluginState.ON);
        }

        mWebView.loadUrl("http://geoapps.esri.co/ubicatuescuela/index.html");
    }

    public void invoke(String origin, boolean allow, boolean remember) {

    }

    final class MyWebChromeClient extends WebChromeClient {

        // Enable passing of console messages for debugging
        public boolean onConsoleMessage(ConsoleMessage cm) {
            Log.e("wv debug", cm.message() + " -- From line "
                    + cm.lineNumber() + " of "
                    + cm.sourceId());
            return true;
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(String origin,
                                                       GeolocationPermissions.Callback callback) {
            super.onGeolocationPermissionsShowPrompt(origin, callback);

            callback.invoke(origin, true, false);
        }

    }
}
