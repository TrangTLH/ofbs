import React from 'react';
import { css } from "@emotion/react";
import BarLoader from "react-spinners/BarLoader";
import PuffLoader from "react-spinners/PuffLoader";

const override = css`
  display: block;
  margin: 0 auto;
  /* border-color: #0a8e01; */
`;

export default function Spinner(props) {
    // const loading = props.loading;
    return (<>
        {
            props.type === 'barloader' && <div>
                <BarLoader
                    color="#198754"
                    loading={true}
                    css={override}
                    width={150}
                    height={7}
                    speedMultiplier={1}
                />
            </div>
        }

        {
            props.type === 'puffloader' && <div>
                <PuffLoader
                    color="#198754"
                    loading={true}
                    css={override}
                    width={150}
                    height={7}
                    speedMultiplier={1}
                />
            </div>
        }
    </>
    )
}
