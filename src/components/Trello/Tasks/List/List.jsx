import React, { Component } from 'react';

// Component styles
require('./list.scss');

// Components
import Card from '../Card/Card.jsx';

/**
 * Represents a category of task
 * @class
 */
class List extends Component {
    render() {
        let listHTML = null;

        // Generate cards for a list
        listHTML = this.props.tasks.map((task, index) => {
            return (
                <Card key={index}
                    index={index}
                    type={this.props.listType}
                    task={task}
                    drag={this.props.drag}
                    edit={this.props.edit}
                    delete={this.props.delete}
                    reOrder={this.props.reOrder} />
            );
        });

        return (
            <div className={this.props.listType}>
                <div className="heading">{this.props.title}</div>

                <div className="cards"
                    data-type={this.props.listType}
                    onDragOver={this.props.dragOver}
                    onDragLeave={this.props.dragLeave}
                    onDrop={this.props.drop}>

                    {listHTML}

                    {/* Render 'add task' button if enabled */}
                    {
                        this.props.defaultAction &&
                        <div className="add-task-btn">
                            <button className="add-task"
                                onClick={this.props.toggleCurrentTaskModal}>
                                Add Task
                    </button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default List;