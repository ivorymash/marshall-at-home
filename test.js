var app = new Reef('#app', {
    data: {
        greeting: 'Hello',
        name: 'world',
        emoji: '👋'
    },
    template: function (props) {
        return `<h1>${props.greeting}, ${props.name}!</h1>`;
    }
});

app.render();