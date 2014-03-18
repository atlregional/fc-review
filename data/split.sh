#!/bin/bash
# this script will split geojson file into county-specific geojson files
# ************************************************************************************************************
file=${1:-}
counties=(Barrow Bartow Cherokee Clayton Cobb Coweta DeKalb Douglas Fayette Forsyth Fulton Gwinnett Henry Newton Paulding Rockdale Spalding Walton)
for county in "${counties[@]}"
do
	echo "Processing $county..."
	ogr2ogr \
	-f "GeoJSON" \
	-where "County like '$county'" \
	"$county.geojson" $file
done