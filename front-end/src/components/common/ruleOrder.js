import React from 'react';

export default function RuleOrder() {
    return (
        <div className="rule">
            <div className="rule-title">Quy định của FBS khi hủy đơn hàng</div>
            <hr />
            <div>
                Khi hủy đơn hàng đang có trạng thái <span className="rule-status">Chờ duyệt</span> thì sẽ được hoàn lại <span className="rule-des"> 100% </span> tiền cọc
            </div>
            <div>
                Khi hủy đơn hàng đang có trạng thái <span className="rule-status">Chưa diễn ra</span> thì sẽ bị phạt theo quy tắc sau:
            </div>
            <div>
                <ul>
                    <li>Khi hủy <span className="rule-des"> trước 7 ngày </span>, hoàn <span className="rule-des"> 100% </span>tiền cọc</li>
                    <li>Khi hủy <span className="rule-des"> trước 5 ngày </span>, hoàn <span className="rule-des"> 70% </span>tiền cọc</li>
                    <li>Khi hủy <span className="rule-des"> trước 3 ngày </span>, hoàn <span className="rule-des"> 50% </span>tiền cọc</li>
                    <li>Khi hủy <span className="rule-des"> sau 3 ngày </span>, hoàn <span className="rule-des"> 0% </span>tiền cọc</li>
                </ul>
            </div>
        </div>
    )
}
