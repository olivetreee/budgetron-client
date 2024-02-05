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
                if (this.from === "DEFICIT") {
                    return "#384660";
                }

                if (this.to === "Total Income") {
                    return "#3498db";
                }

                return "#e74c3c"
            }
        },
        hovered: {
            labels: {
                enabled: false
            },
            fill: function() {
                if (this.from === "DEFICIT") {
                    return "#384660aa";
                }

                if (this.to === "Total Income") {
                    return "#3498dbaa";
                }

                return "#e74c3caa"
            },
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
            if (this.name === "Total Income") {
                return "#2e9a5b";
            }

            if (this.name === "DEFICIT") {
                // return "#95a5a6"
                return "#7f8c8d"
            }

            return this.sourceColor;
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
