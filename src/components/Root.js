import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'




class Root extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sprs: {
                tabClicked: false,
                data: []
            },
            type: {
                tabClicked: false,
                data: []

            }
        }
        this.submit = this.submit.bind(this)

    }

    submit(e) {
        const { _title, _color } = this.refs
        e.preventDefault()
        this.props.onNewColor(_title.value, _color.value)
        _title.value = ''
        _color.value = '#000000'
        _title.focus();
    }
    componentDidMount() {

        this.timerID = setInterval(
            () => this.tick(), 20000

        );


    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {

        fetch('http://outlet3.dev.ch3.s.com/d/dashboard/service/sprs/2017-9-2/2017-10-2')
            .then(response => response.json())
            .then(countryName => {
                const sprsNewObject = Object.assign({}, this.state.sprs, { data: [countryName.sprs.graphsData] })
                this.setState({ sprs: sprsNewObject, tabClicked: false })
            })

        fetch('http://outlet3.dev.ch3.s.com/d/dashboard/service/ffm_trends/2016-1-1/2016-1-2?siteId=9322')
            .then(response => response.json())
            .then(countryName => {
                const ffmTrendsObject = Object.assign({}, this.state.type, { data: [countryName.type] })
                this.setState({ type: ffmTrendsObject, tabClicked: false })
            })



    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit}>
                    <input type="text" placeholder="colortitle" ref="_title" required />
                    <input type="color" ref="_color" required />
                    <button> Add </button>
                </form>


            </div>
        )


    }





}
