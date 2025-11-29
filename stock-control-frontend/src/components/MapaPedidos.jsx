import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapaPedidos({ pedidos }) {
  return (
    <MapContainer center={[-31.4201, -64.1888]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pedidos.map(p => (
        p.lat && p.lng && (
          <Marker key={p.id} position={[p.lat, p.lng]}>
            <Popup>
              <b>{p.cliente_nombre}</b><br />
              {p.direccion}<br />
              Estado: {p.estado}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default MapaPedidos;