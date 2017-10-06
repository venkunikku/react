import React from 'react'
import { render } from 'react-dom'

//const SVG = ({ children, width, height, id, tranformationGraphArea }) =>


class SVG extends React.Component {
    constructor(props) {
        super(props)

    }

    render() {
        const { children, width, height, id, tranformationGraphArea } = this.props
        return (
            <svg id={id} height={height} width={width}>
                {children}
            </svg>

        )

    }


}

const XScaleLinear = () => "my xScale"

const SMS = () => "simple"

export { SVG }