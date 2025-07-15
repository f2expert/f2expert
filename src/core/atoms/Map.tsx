import React from "react";
import GoogleMapReact from 'google-map-react';

interface AnyReactComponentProps {
  text: string;
  lat: number;
  lng: number;
}

const AnyReactComponent: React.FC<AnyReactComponentProps> = ({ text }) => <div>{text}</div>;

export default function Map(){
  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627
    },
    zoom: 11
  };

  return (
    // Important! Always set the container height explicitly
    <div className="w-80 h-56">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={59.955413}
          lng={30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}