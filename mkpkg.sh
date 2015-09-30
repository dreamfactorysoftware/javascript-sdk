#!/bin/sh

if [ "$1x" = "x" ] ; then
   echo "Please specify an app api name."
else
    app="$1"
    zipfile="$app.zip"
    if [ -f "$zipfile" ]
    then
       echo "Removing "$zipfile
       rm $zipfile
    fi
    zipfile="$app.dfpkg"
    if [ -f "$zipfile" ]
    then
       echo "Removing "$zipfile
       rm $zipfile
    fi
    other=""
    if [ -f "description.json" ]
    then
        other=$other" description.json"
    fi
    if [ -f "schema.json" ]
    then
        other=$other" schema.json"
    fi
    if [ -f "data.json" ]
    then
        other=$other" data.json"
    fi
    if [ -f "services.json" ]
    then
        other=$other" services.json"
    fi
    zip -r $zipfile $app $other -x "*/\.*"
    zipfile="$app.zip"
    zip -r $zipfile $app -x "*/\.*"
fi

