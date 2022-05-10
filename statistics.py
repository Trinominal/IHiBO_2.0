import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.colors as mcolors
import csv
import numpy as np

gasMeasurementsRed = []
gasMeasurementsExt = []
tmpGasRed = []
tmpGasExt = []


def plot1():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(7, 5)
    blue_patch = mpatches.Patch(
        color='tab:blue', label='Enumerating Preferred Extensions of AF method')
    red_patch = mpatches.Patch(
        color='tab:red', label='Reductions of PAF to AF (PR3) method')

    sxrange = []
    width = 0.4
    j = -1
    for i in range(len(gasMeasurementsRed)):
        if i % 3 == 0:
            j += 1.2
            sxrange.append(i - j + .9 - width)
        elif i % 3 == 1:
            sxrange.append(i - j)
        else:
            sxrange.append(i - j - .9 + width)

    sxrange = np.array(sxrange)
    # print(sxrange)

    plt.ylabel('Gas Cost', fontsize=12)
    # plt.title('Argumentation Gas Cost', fontdict={'fontsize': 16}, weight='heavy')
    plt.bar(sxrange - (width/4), gasMeasurementsRed, (width/2), color='tab:red',
            align='center')
    plt.bar(sxrange + (width/4), gasMeasurementsExt, (width/2), color='tab:blue',
            align='center')
    plt.xticks(sxrange, ['0.33\n', '0.5\n(5 arguments)', '0.66\n',
                         '0.33\n', '0.5\n(10 arguments)', '0.66\n',
                         '0.33\n', '0.5\n(15 arguments)', '0.66\n',
                         '0.33\n', '0.5\n(20 arguments)', '0.66\n'])
    plt.xlabel('Attack Formation Probability (p)', fontsize=12)

    plt.legend(handles=[blue_patch, red_patch], fontsize='large')
    plt.show()
    #plt.savefig('./gas-cost.png', bbox_inches='tight', dpi=300)


def plot12():
    matrxT1 = [gasMeasurementsExt[::3], gasMeasurementsRed[::3]]
    matrxT2 = [gasMeasurementsExt[1::3], gasMeasurementsRed[1::3]]
    matrxT3 = [gasMeasurementsExt[2::3], gasMeasurementsRed[2::3]]
    labls = ['Enumerating Preferred\nExtensions of AF method',
             'Reductions of PAF\nto AF (PR3) method']

    # ['tab:blue', 'tab:red', 'tab:green']
    colors = list(mcolors.TABLEAU_COLORS).copy()

    fig, axs = plt.subplots(1, 3, sharey=True, figsize=(10.6, 6))

    for c in range(len(matrxT1)):
        axs[0].plot(range(5, 21, 5), matrxT1[c], 'v', linestyle='-',
                    color=colors[c],  markersize=4)
        axs[1].plot(range(5, 21, 5), matrxT2[c], 'v',
                    linestyle='-', color=colors[c], markersize=4)
        axs[2].plot(range(5, 21, 5), matrxT3[c], 'v',
                    linestyle='-', color=colors[c], label=labls[c], markersize=4)
        axs[0].grid(color='0.95')
        axs[1].grid(color='0.95')
        axs[2].grid(color='0.95')

    axs[2].legend(title='')
    axs[0].set_ylabel('Gas used', fontsize=12)
    axs[1].set_xlabel('Arguments Number', fontsize=12)
    axs[0].set_title('0.33')
    axs[1].set_title('Attack Formation Probability (p)\n0.5')
    axs[2].set_title('0.66')

    # plt.show()
    plt.savefig('./gas-cost12.png', bbox_inches='tight', dpi=300)


with open('data.csv', 'r') as csvFile:
    reader = csv.reader(csvFile)
    next(reader)
    nodesTmp = 5
    edgesPTmp = 0.33
    for row in reader:
        nodesNumber = int(row[0])
        edgesNumber = int(row[1])
        edgesP = float(row[2])
        prefP = float(row[3])
        reductionPref3 = int(row[4])
        prefExtensionsGas = int(row[5])

        if (nodesNumber != nodesTmp or edgesP != edgesPTmp):
            nodesTmp = nodesNumber
            edgesPTmp = edgesP
            gasMeasurementsRed.append(np.mean(tmpGasRed))
            gasMeasurementsExt.append(np.mean(tmpGasExt))
            tmpGasRed = []
            tmpGasExt = []
        tmpGasRed.append(reductionPref3)
        tmpGasExt.append(prefExtensionsGas)
    gasMeasurementsRed.append(np.mean(tmpGasRed))
    gasMeasurementsExt.append(np.mean(tmpGasExt))
    # plot1()
    plot12()
