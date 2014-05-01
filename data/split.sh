#!/bin/bash
# this script will split geojson file into county-specific geojson files
# ************************************************************************************************************
file=${1:-}
counties=(Barrow Bartow Carroll Cherokee Clayton Cobb Coweta Dawson DeKalb Douglas Fayette Forsyth Fulton Gwinnett Hall Henry Newton Paulding Rockdale Spalding Walton)
for county in "${counties[@]}"
do
	echo "Processing $county..."
	ogr2ogr \
	-f "GeoJSON" \
	-t_srs crs:84 \
	-where "County like '$county'" \
	"$county.geojson" $file
done
