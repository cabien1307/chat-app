module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'background': '#fffffe',
                'heading': '#020826',
                'sub-head': '#f25042',
                'desc': '#716040',
                'btn-bg': '#8c7851',
                'btn-text': '#fffffe',
                'stroke': '#020826',
                'secondary': '#eaddcf',
                'links': '#8c7851',
            }
        },
        screen: {
            'sm': { 'min': '320px', 'max': '480px' },
            'md': { 'min': '481px', 'max': '768px' },
            'lg': { 'min': '769px', 'max': '1024px' },
            'xl': { 'min': '1025px', 'max': '1200px' },
            '2xl': { 'min': '1201px ' },
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
