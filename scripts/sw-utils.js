//
//
//

function actualizaCacheDinamico(dynamicCache, req, res ){
    if( res.ok ){
        return caches.open(dynamicCache).then( cache => {
            console.log('actualizaCacheDinamico', req.url);

            cache.put(req, res.clone() );
            return res.clone();
        });
    }else{
        return res;
    }

}
