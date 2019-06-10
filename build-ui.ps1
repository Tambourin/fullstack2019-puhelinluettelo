rm -path "build" -recurse;
cd ../osa2/puhelinluettelo;
npm run build; 
cp -r build ../../puhelinluettelo;
cd ../../puhelinluettelo;