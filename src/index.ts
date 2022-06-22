import lookupFactory from './lookup-factory';

(async () => {
    const fetchBusiness = lookupFactory();

    try {
        const data = await fetchBusiness('1080465-1');
        console.log(data);
    } catch (e) {
        console.log(e);
    }

})();