/* eslint-disable react-hooks/exhaustive-deps */
import { api } from '../../config/axios';
import React, { useEffect } from 'react';
import {
    Button
} from 'reactstrap';

import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';

export default function AddDishComboItem(props) {
    const dish = props.dish;
    const combo = props.combo;
    const count = props.count;
    const dishModal = props.dishModal;

    let check = 0;

    const checkExist = () => {
        dishModal && dishModal.forEach(item => {
            if (item.id === dish.id) {
                check = check + 1;
                let btn = null;
                btn = document.getElementById('add-' + dish.id);
                if (btn !== undefined && btn != null) {
                    btn.disabled = true;
                }
                return;
            }
        });
    }

    checkExist();

    useEffect(() => {
        checkExist();
    }, [dishModal, check]);

    const addToCombo = () => {
        let comboApi = [];
        let dishApi = [];
        document.getElementById('add-' + dish.id).disabled = true;

        if (check === 0) {
            api.get(`/combos/getComboById?comboId=${combo.combo_id}`)
                .then(res => {
                    comboApi = res.data;
                    api.get(`/dishes/getDishesById?dishId=${dish.id}`)
                        .then(res => {
                            dishApi = res.data;
                            api.post(`/dishes/addDishToCombo`,
                                {
                                    "combo": comboApi,
                                    "dish": dishApi
                                }, {
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                            }
                            )
                                .then(res => {
                                    Notify("Thêm thành công !", "success", "top-right");
                                    props.getDishByCombo();
                                })
                        })
                })
        } else {
            Notify("Món ăn đã có trong combo !", "warning", "top-right");
        }
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{formatCurrency(dish.price)}</td>
            <td>{dish.category_name}</td>
            <td>
                {
                    check === 0 ? (<Button id={`add-${dish.id}`} color="primary" onClick={(e) => {
                        e.preventDefault();
                        checkExist();
                        addToCombo();
                    }}
                    >
                        Thêm
                    </Button>) : (
                        <Button id={`add-${dish.id}`} color="primary" disabled>
                            Thêm
                        </Button>
                    )
                }
            </td>
        </tr >
    )
}
