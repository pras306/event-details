import React from 'react';

import './Grid.css';

const Grid = ({ data, actionExecute }) => {
    const stringChecker = (str) => {
        return str.replace(/_/g, " ").toUpperCase();
    };

    const onActionButtonClick = (action) => {
        actionExecute(action);
    };

    const renderGridHeader = () => {
        if(data.length > 0) {
            return (
                <tr>
                    {Object.keys(data[0]).map((header, idx) => {
                        return <th key={idx}>{stringChecker(header)}</th>
                    })}        
                    <th>ACTION BUTTONS</th>
                </tr>
            );
        }
    };

    const renderActionButtons = (row, actionText, btnType, disabled) => {
        const action = {
            eventId: row,
            action: actionText
        };
        return (
            <button type="button" className={`btn btn-default btn-${btnType} btn__capitalize`} disabled={disabled} onClick={() => onActionButtonClick(action)}>{actionText}</button>
        )
    };

    const renderGrid = () => {
        if(data.length > 0){
            return data.map((row, idx) => {
                return (
                    <React.Fragment key={idx}>
                        <tr>
                            {
                                Object.values(row).map((item, id) => {
                                    return <td key={id}>{item.toString()}</td>
                                })
                            }
                            <td>
                                <div className="btn-group" role="group">
                                    {renderActionButtons(row.id, "view", "success", false)}
                                    {renderActionButtons(row.id, "edit", "warning", false)}
                                    {renderActionButtons(row.id, "delete", "danger", true)}
                                </div>
                            </td>
                        </tr>
                    </React.Fragment>
                );
            });
        }
    };

    return (
        <div className="grid p3 my-3">
            <div className="table-responsive">
                <table className="table table-dark table-hover">
                    <thead>
                        {renderGridHeader()}
                    </thead>
                    <tbody>
                        {renderGrid()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Grid;
