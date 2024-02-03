import AnyChart from 'anychart-react'
import { printMoney } from '../utils';

export const SankeyGraph = ({ data }) => {
    // TODO: Maybe some of these would be better coming from the consumer, if we ever get to
    // multiple Sankey graphs.
    const flow = {
        normal: {
            labels: {
                enabled: false
            },
            fill: function() {
                return this.to === "Total Income" ? "#3498db" : "#e74c3c"
            }
        },
        hovered: {
            labels: {
                enabled: false
            },
            fill: function() {
                return this.to === "Total Income" ? "#3498dbaa" : "#e74c3caa"
            }
        },
        tooltip: {
            format: function() { return printMoney(this.value, false) }
        }
    };

    const node = {
        tooltip: {
            format: function() { return printMoney(this.value, false) },
            titleFormat: function() { return this.name },
        },
        fill: function() {
            return this.name === "Total Income" ? "#2e9a5b" : this.sourceColor
        }
    }

    const dropoff = {
        normal: {
            fill: "#2ecc71"
        },
        hovered: {
            fill: "#2ecc71aa"
        },
        tooltip: {
            format: function() { return printMoney(this.value, false) },
            titleFormat: "Leftovers",
        },
    }

    return (
        <>
            <AnyChart
                type="sankey"
                data={data}
                background="transparent"
                height={800}
                curveFactor={0.5}
                nodePadding={15}
                flow={ flow }
                node={ node }
                dropoff={ dropoff }
                nodeWidth={"20%"}
            />
        </>
    )
};
