import React, { useEffect, useState } from 'react'
import { Button, List, ListItem, ListItemButton } from '@mui/material'
import './PlacesSidebar.css'

type TypesType = {
    [key: string]: string
}

const typesDict: TypesType = {
    "lodging": "Lodging",
    "point_of_interest": "Point of Interest",
    "establishment": "Establishment"
};

export function PlacesSidebar({ places, handleClick }: any) {
    const [placeItems, setPlaceItems] = useState<any[] | null>(null);

    useEffect(() => {
        const newItems: React.SetStateAction<any[] | null> = [];
        places.forEach((place: any, placeId: string) => {
            const displayTypes = place.types.map((t: string) => typesDict[t]);
            let types = displayTypes
                .slice(0, -1)
                .reduce((acc: string, type: string) => {
                    return acc + type + " • "
                }, "");
            types += displayTypes[displayTypes.length - 1];

            const addressParts = place.address_components.filter((a: any) => a.types[0] === 'street_number' || a.types[0] === 'route');
            let address = addressParts[0].short_name + " " + addressParts[1].short_name;
            if (addressParts[0].types[0] == 'route') {
                address = addressParts[1].short_name + " " + addressParts[0].short_name;
            }

            const photo = place.encoded_photo ? <img className="placePhoto" src={`data:image/png;base64,${place.encoded_photo}`}></img> : null;
            const item = <ListItem
                key={place.name}
                onClick={() => handleClick(place.place_id)}
                className='sidebarItem'
            >
                <ListItemButton
                    alignItems='flex-start'
                    classes={{ root: 'placeSidebarItem' }}>
                    <div className="itemContent">
                        <h3>{place.name}</h3>
                        <p>{types}</p>
                        <p>{address}</p>
                        <p>{place.editorial_summary ? place.editorial_summary.overview : ""}</p>
                    </div>
                </ListItemButton>
            </ListItem>
            newItems.push(item);
        });
        setPlaceItems(newItems);
    }, [places]);

    return (
        <div className='sidebar'>
            <List style={{ maxHeight: '100%', overflow: 'auto' }}>
                {placeItems}
            </List>
        </div>
    )
}