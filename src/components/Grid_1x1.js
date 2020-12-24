import "./Grid.css"
import React, { Component } from "react";
// import propTypes from 'prop-types'
//TODO
export default class Grid_1x1 extends Component {

// Useful hints:
// for React Component:
    // static propTypes = {
    //     gridValue:,
    //     selectedGrid: propTypes.object.isRequired
    // }
    
    render () {
        let {handle_grid_1x1_click, selectedGrid, col_index, row_index, value} = this.props
        //console.log(selectedGrid)
        const gridStyle = {
            color: selectedGrid.row_index === row_index && selectedGrid.col_index === col_index || this.props.conflicted ? "#FFF" : this.props.fixed ? "#666" : "#6CC",
            backgroundColor: selectedGrid.row_index === row_index && selectedGrid.col_index === col_index ? "#333" : this.props.conflicted ? "#E77" : "#FFF",
            borderLeft: col_index % 3 === 0 ? "1.5px solid transparent" : "1.5px solid #999",
            borderRight: col_index % 3 === 2 ? "1.5px solid transparent" : "1.5px solid #999",
            borderTop: row_index % 3 === 0 ? "1.5px solid transparent" : "1.5px solid #999",
            borderBottom: row_index % 3 === 2 ? "1.5px solid transparent" : "1.5px solid #999"
        };
        return (
            <div className="grid_1x1" id={`grid-${row_index}*${col_index}`} tabindex="1" style={gridStyle} onClick={() => handle_grid_1x1_click(row_index, col_index)}>
                {value === '0' ? '' : value}
            </div>
        );
    }
}
