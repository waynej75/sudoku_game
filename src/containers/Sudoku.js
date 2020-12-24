import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Fireworks } from 'fireworks/lib/react'

import "./Sudoku.css"
import Header from '../components/Header';
import Grid_9x9 from '../components/Grid_9x9';
import ScreenInputKeyBoard from '../components/ScreenInputKeyBoard'
import { problemList } from "../problems"

class Sudoku extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true, // Return loading effect if this is true.
            problem: null, // Stores problem data. See "../problems/" for more information.This is the origin problem and should not be modified. This is used to distinguish the fixed numbers from the editable values
            gridValues: null,  // A 2D array storing the current values on the gameboard. You should update this when updating the game board values.
            selectedGrid: { row_index: -1, col_index: -1 }, // This objecct store the current selected grid position. Update this when a new grid is selected.
            gameBoardBorderStyle: "8px solid #000", // This stores the gameBoarderStyle and is passed to the gameboard div. Update this to have a error effect (Bonus #2).
            completeFlag: false, // Set this flag to true when you wnat to set off the firework effect.
            conflicts: [{ row_index: -1, col_index: -1 }] // The array stores all the conflicts positions triggered at this moment. Update the array whenever you needed.
        }
    }

    handle_grid_1x1_click = (row_index, col_index) => {
        let {problem, selectedGrid} = this.state
        if (problem.content[row_index][col_index] === "0") {
            this.setState({ selectedGrid: { row_index: row_index, col_index: col_index } });
        }
        else this.setState({selectedGrid: {row_index: -1, col_index: -1}})
        console.log(selectedGrid)
    }

    handleKeyDownEvent = (e) => {
        let {problem, gridValues, selectedGrid, conflicts} = this.state
        console.log(gridValues)
        if (gridValues !== null && selectedGrid.row_index !== -1 && selectedGrid.col_index !== -1 && ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) ) {
            if (problem.content[selectedGrid.row_index][selectedGrid.col_index] === '0'){
                if(this.findConflicts(selectedGrid.row_index, selectedGrid.col_index, e.key !== '0' ? e.key : '-1') || e.key === '0'){  
                    gridValues[selectedGrid.row_index][selectedGrid.col_index] = e.key
                    this.setState({ gridValues })
                    if (this.isCompeleted(gridValues)){
                        this.setState({completeFlag: true})
                        setTimeout(() => this.setState({completeFlag: false}), 3000)
                    }
                }
                else {
                    //
                    this.setState({ gameBoardBorderStyle: "8px solid #E77" });
                    setTimeout(() => { this.setState({ conflicts: [] }); }, 1000);
                    setTimeout(() => { this.setState({ gameBoardBorderStyle: "8px solid #333" }) }, 1000)
                }
            }
        }
    }

    findConflicts = (row, col, value) => {
        let conflicts = []
        const {gridValues} = this.state
        for(let i = 0; i < 9; i++){
            if(i !== row && gridValues[i][col] === value) {
                conflicts.push({row_index : i, col_index : col})
            }
            if(i !== col && gridValues[row][i] === value) {
                conflicts.push({row_index : row, col_index : i})
            }
            const sq_row = Math.floor(row / 3) * 3 + Math.floor(i / 3);
            const sq_col = Math.floor(col / 3) * 3 + i % 3;
            if((sq_row !== row || sq_col !== col) && gridValues[sq_row][sq_col] === value){
                conflicts.push({row_index : sq_row, col_index : sq_col})
            }
        }
        this.setState({ conflicts: conflicts });
        //setTimeout(() => { this.setState({ conflicts: [] }); }, 1000);
        return conflicts.length === 0 ? true : false
    }

    isValid(board, r, c, d){
        for(let i = 0; i < 9; i++){
            if (board[i][c] === d) return false;
            if (board[r][i] === d) return false;
            const box_r = Math.floor(r / 3) * 3 + Math.floor(i / 3)
            const box_c = Math.floor(c / 3) * 3 + i % 3
            if (board[box_r][box_c] === d) return false;
        }
        return true;
    }

    isCompeleted = (gridValues) => {
        for (let i = 0; i < gridValues.length; i++){
            for(let j = 0; j < gridValues[0].length; j++){
                if(gridValues[i][j] === '0') return false
            }
        }
        return true
    }

    handleScreenKeyboardInput = (num) => {
        this.handleKeyDownEvent({ key: String(num), keyCode: num + 48 });
    }
    
    handleAutoComplete = () => {
        let {gridValues} = this.state
        this.fill(gridValues, 0, 0)
    }

    // fill = (gridValues, used, rs, cs) => {
    //     for(let r = rs; r < 9; r++, cs = 0){
    //         for(let c = cs; c < 9; c++){
    //             if(gridValues[r][c] !== '0') continue
    //             for (let d = 1; d < 10; d++){
    //                 console.log(r, c, d)
    //                 let b = Math.floor(r/3)*3 + Math.floor(c/3)
    //                 if(!used.row[r][d] && !used.col[c][d] && !used.box[b][d]) {
    //                     gridValues[r][c] = String(d)
    //                     used.row[r][d] = 1;
    //                     used.col[c][d] = 1;
    //                     used.box[b][d] = 1;
    //                     if (this.fill(gridValues, used, r, c+1)) {
    //                         this.setState({gridValues: gridValues});
    //                         return true;
    //                     }
    //                     gridValues[r][c] = '0'     
    //                     used.row[r][d] = 0;
    //                     used.col[c][d] = 0;
    //                     used.box[b][d] = 0;   
    //                 }
    //             }
    //             return false
    //         }
    //     }
    //     return true
    // }

    fill = (gridValues, rs, cs) => {
        for(let r = rs; r < 9; r++, cs = 0){
            for(let c = cs; c < 9; c++){
                if(gridValues[r][c] !== '0') continue
                for (let d = 1; d < 10; d++){
                    console.log(r, c, d)
                    if( this.isValid(gridValues, r, c, String(d))) {
                        gridValues[r][c] = String(d)
                        if(this.fill(gridValues, r, c+1)){
                            this.setState({ gridValues: gridValues })
                            return true
                        }
                        gridValues[r][c] = '0' 
                    }
                }
                return false   
            }
        }
        return true
    }

    componentDidMount = () => {
        window.addEventListener('keydown', this.handleKeyDownEvent);
    }

    loadProblem = async (name) => {
        this.setState({
            loading: true,
            problem: null,
            gridValues: null,
            selectedGrid: { row_index: -1, col_index: -1 }
        });

        const problem = await require(`../problems/${name}`)
        if (problem.content !== undefined) {
            let gridValues = [];
            for (let i = 0; i < problem.content.length; i++)
                gridValues[i] = problem.content[i].slice();
            this.setState({ problem: problem, gridValues: gridValues, loading: false });
        }
    }

    extractArray(array, col_index, row_index) {
        let rt = []
        for (let i = row_index; i < row_index + 3; i++) {
            for (let j = col_index; j < col_index + 3; j++) {
                rt.push(array[i][j])
            }
        }
        return rt;
    }

    render() {
        const fxProps = {
            count: 3,
            interval: 700,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            colors: ['#cc3333', '#81C784'],
            calc: (props, i) => ({
                ...props,
                x: (i + 1) * (window.innerWidth / 3) * Math.random(),
                y: window.innerHeight * Math.random()
            })
        }
        return (
            <>
                <Header
                    problemList={problemList}
                    loadProblem={this.loadProblem}
                    handleResetGame={this.handleResetGame}
                    handleAutoComplete={this.handleAutoComplete} />

                {this.state.loading ? (<ReactLoading type={"bars"} color={"#777"} height={"40vh"} width={"40vh"} />) : (
                    <div id="game-board" className="gameBoard" style={{ border: this.state.gameBoardBorderStyle }}>
                        <div className="row">
                            <Grid_9x9 row_offset={0} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={0} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 0)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 0)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={3} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={3} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 3)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 3)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                        <div className="row">
                            <Grid_9x9 row_offset={6} col_offset={0}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 0, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 0, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={3}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 3, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 3, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />

                            <Grid_9x9 row_offset={6} col_offset={6}
                                handle_grid_1x1_click={this.handle_grid_1x1_click}
                                value={this.extractArray(this.state.gridValues, 6, 6)}
                                fixedValue={this.extractArray(this.state.problem.content, 6, 6)}
                                selectedGrid={this.state.selectedGrid}
                                conflicts={this.state.conflicts} />
                        </div>
                    </div>
                )}
                {this.state.completeFlag ? (<Fireworks {...fxProps} />) : null}
                {this.state.loading ? null : (<ScreenInputKeyBoard handleScreenKeyboardInput={this.handleScreenKeyboardInput} />)}
            </>
        );
    }
}

export default Sudoku;