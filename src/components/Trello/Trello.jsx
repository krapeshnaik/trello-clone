import React, {
    Component
} from 'react';

// Components
import Header from './Header/Header.jsx';
import Tasks from './Tasks/Tasks.jsx';
import Footer from './Footer/Footer.jsx';

/**
 * Represents Application container
 * @class
 */
class App extends Component {
    render() {
        return (
            <div className="trello-clone animated">
                <Header />
                <Tasks />
                <Footer />
            </div>
        );
    }
}
export default App;