suppressMessages(library(dplyr))
suppressMessages(library(ggplot2))
suppressMessages(library(jsonlite))

sumRows <- function(d, ... ) {
  by_vars <- group_by_(d, ...)
  summed_groups <- summarise_if(by_vars, .predicate = function(x) is.numeric(x), funs("sum"))
  return(ungroup(summed_groups))
}

generateLeaderboard <- function(d, sortCol, sortDir, keyCols) {
  sortExpr = sprintf("%s(%s)", sortDir, sortCol)
  allCols = c(keyCols, sortCol)
  leaders <- arrange_(d, sortExpr)
  leaders <- selectWithKeys(leaders, keyCols, sortCol)
  leaders <- filter(leaders, row_number() <= 10L)
  p <- tableGrob(leaders)
  gp <- grid.arrange(p)
  ggsave(filename="output.svg", width=3, height=3, dpi=100, gp)
}

selectWithKeys <- function(d, keyCols, ...) {
  allCols = c(keyCols, c(...))
  return(select(d, one_of(allCols)))
}

# Script starts here
args <- commandArgs(trailingOnly = TRUE)
inputJson <- rawToChar(base64_dec(args[1]))
input <- fromJSON(inputJson)
selectedData <- read.csv(input$dsSource)
image=qplot(HR, data=selectedData, geom="bar")
ggsave(file=input$outputFile, plot=image, width=10, height=8)