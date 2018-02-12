import React, { PureComponent } from 'react';

// Component styles
require('./card.scss');

/**
 * Represents a Card
 * @class
 */
class Card extends PureComponent {
    render() {
        return (
            <div className={`card fadeInUp ${this.props.task.priority}`}
                draggable="true"
                data-id={this.props.index}
                data-type={this.props.type}
                onDragStart={this.props.drag}>
                <div className="title">{this.props.task.title}</div>
                <div className="description">{this.props.task.description}</div>

                {/* Card actions */}
                <div className="actions">
                    <div className="re-order">
                        <span className="up"
                            onClick={() => this.props.reOrder('up', this.props.type, this.props.index)}></span>
                        <span className="down"
                            onClick={() => this.props.reOrder('down', this.props.type, this.props.index)}></span>
                    </div>
                    <span className="edit"
                        onClick={() => this.props.edit(this.props.type, this.props.index)}>Edit</span>
                    <span className="delete"
                        onClick={() => this.props.delete(this.props.type, this.props.index)}>Delete</span>
                </div>
            </div>
        );
    }
}
export default Card;