suppressMessages(require("ggplot2"))
args <- commandArgs(trailingOnly = TRUE)
image=qplot(clarity, data=diamonds, fill=cut, geom="bar")
ggsave(file=args[1], plot=image, width=10, height=8)