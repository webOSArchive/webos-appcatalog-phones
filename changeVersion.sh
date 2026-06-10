for i in `find . -name 'appinfo.json'`
do
sed -i 's/2.0.23200/2.0.23300/g' $i
done
find . -name 'appinfo.json' | xargs cat | grep version
