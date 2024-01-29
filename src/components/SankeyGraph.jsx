import AnyChart from 'anychart-react'

export const SankeyGraph = ({ data }) => {
    // const data = [
    //     {from: 'First Class', to: 'Child', value: 6},
    //     {from: 'Second Class', to: 'Child', value: 24},
    //     {from: 'Third Class', to: 'Child', value: 79},
    //     {from: 'Crew', to: 'Child', value: 0},
    //     {from: 'First Class', to: 'Adult', value: 319},
    //     {from: 'Second Class', to: 'Adult', value: 261},
    //     {from: 'Third Class', to: 'Adult', value: 627},
    //     {from: 'Crew', to: 'Adult', value: 300},
    //     {from: 'Crew', to: 'Adult', value: 585},
    //     {from: 'Child', to: 'Female', value: 45},
    //     {from: 'Child', to: 'Male', value: 64},
    //     {from: 'Adult', to: 'Female', value: 425},
    //     {from: 'Adult', to: 'Male', value: 1667},
    // ]

    return (
        <>
            <AnyChart
                type="sankey"
                data={data}
                height={800}
            />
        </>
    )
};
