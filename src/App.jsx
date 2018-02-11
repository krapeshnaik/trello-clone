import React, { PureComponent } from 'react';

// Components
import Trello from './components/Trello/Trello.jsx';

// Component styles
require('./app.scss');
class App extends PureComponent {
    render() {
        return (
            <Trello />
        );
    }
}
export default App;