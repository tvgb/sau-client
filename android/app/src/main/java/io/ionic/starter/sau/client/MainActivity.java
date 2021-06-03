package io.ionic.starter.sau.client;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.tvgb.cpt.CapacitorTtsPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(CapacitorTtsPlugin.class);
    }
}
