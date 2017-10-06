


import * as d3 from 'd3'
export const parseTime = d3.timeFormat("%m/%d/%y")
export const timeParse = d3.timeParse("%m/%d/%y");
export const yearMonthDayWithDash = d3.timeFormat("%Y-%-m-%-d");
export const currencyFormat = d3.format(",.2r")

export const daysBackDate = (days = 30) => {
	let todayDate = new Date()
	let daysBackDt = todayDate.setDate(todayDate.getDate() - days)
	return daysBackDt
}