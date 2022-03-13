import React from 'react';
import { Button } from 'reactstrap';
import { FaTrashAlt } from 'react-icons/fa';
import { api } from '../../config/axios';

export default function DishComboItem(props) {
    const dish = props.dish;
    const combo = props.combo;
    const checkCombo = props.checkCombo;
    let count = props.count;

    const deleteDish = () => {
        api.delete(`/dishes/removeDishFromCombo?comboId=${combo.combo_id}&dishId=${dish.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
            }).finally(() => {
                props.getDishByCombo();
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{dish.category_name}</td>
            {
                !props.isAdmin && checkCombo === 0 && <td>
                    <Button color="danger" onClick={deleteDish}><FaTrashAlt className="icon-delete" />Xóa</Button>
                </td>
            }
        </tr >
    )
}
