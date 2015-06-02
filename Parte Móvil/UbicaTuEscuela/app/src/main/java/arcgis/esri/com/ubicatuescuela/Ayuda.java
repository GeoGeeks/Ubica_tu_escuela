package arcgis.esri.com.ubicatuescuela;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;


public class Ayuda extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ayuda);
        getSupportActionBar().hide();
        TextView texto=(TextView)findViewById(R.id.textView);
        texto.setMovementMethod(new ScrollingMovementMethod());

    }

    public void verMapa(View v){
        Intent i = new Intent(this,Mapa.class);
        startActivity(i);
    }
}
