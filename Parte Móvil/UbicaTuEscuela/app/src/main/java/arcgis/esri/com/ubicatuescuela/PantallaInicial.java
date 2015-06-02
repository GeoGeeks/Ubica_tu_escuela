package arcgis.esri.com.ubicatuescuela;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;


public class PantallaInicial extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pantalla_inicial);
        getSupportActionBar().hide();
    }

    public void verMapa(View v){
        Intent i = new Intent(this,Mapa.class);
        startActivity(i);
    }

    public void verAyuda(View v){
        Intent i = new Intent(this,Ayuda.class);
        startActivity(i);
    }
}
