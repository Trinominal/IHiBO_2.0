import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.colors as mcolors
import csv
import numpy as np

gasMeasurementsRed = []
gasMeasurementsExt = []
tmpGasRed = []
tmpGasExt = []

gasMeasurementsNeg = []
gasMeasurementsOff = []
gasMeasurementsAcc = []

gasMeasurementsAdd = []
tmpGasAdd = []

boxplotData = []
boxplotData2 = []


def plot11():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(7, 5)
    blue_patch = mpatches.Patch(
        color='tab:blue', label='Enumerating Preferred Extensions of AF method')
    red_patch = mpatches.Patch(
        color='tab:red', label='Reductions of PAF to AF method')

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
    plt.xticks(sxrange, ['0.33\n', '0.5\n5 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n10 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n15 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n20 nodes\n(i.e. arguments)', '0.66\n'])
    plt.xlabel('Edge (i.e. attack) Formation Probability (p)', fontsize=12)

    plt.legend(handles=[blue_patch, red_patch], fontsize='large')
    plt.show()
    #plt.savefig('./gas-cost11.png', bbox_inches='tight', dpi=300)


def plot12():
    matrxT1 = [gasMeasurementsExt[::3], gasMeasurementsRed[::3]]
    matrxT2 = [gasMeasurementsExt[1::3], gasMeasurementsRed[1::3]]
    matrxT3 = [gasMeasurementsExt[2::3], gasMeasurementsRed[2::3]]
    labls = ['Enumerating Preferred\nExtensions of AF method',
             'Reductions of PAF\nto AF (PR3) method']

    # ['tab:blue', 'tab:red', 'tab:green']
    colors = list(mcolors.TABLEAU_COLORS).copy()

    fig, axs = plt.subplots(1, 3, sharey=True, figsize=(7, 5))

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
    axs[1].set_xlabel('Arguments Number (Graph size)', fontsize=12)
    axs[0].set_title('0.33')
    axs[1].set_title('Attack Formation Probability (p)\n0.5')
    axs[2].set_title('0.66')

    # plt.show()
    plt.savefig('./gas-cost12.png', bbox_inches='tight', dpi=300)


def plot21():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(5, 4)

    width = 0.5
    plt.ylabel('Gas Cost', fontsize=12)
    plt.xlabel('Issues Number', fontsize=12)
    # plt.title('Argumentation Gas Cost', fontdict={'fontsize': 16}, weight='heavy')
    # plt.ylim(72000, 558547)
    plt.bar(range(1, 26), gasMeasurementsNeg, width,
            align='center')

    # plt.show()
    plt.savefig('./gas-cost21.png', bbox_inches='tight', dpi=300)


def plot22():
    colors = list(mcolors.TABLEAU_COLORS).copy()
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(5, 4)

    plt.ylabel('Gas used', fontsize=12)
    plt.xlabel('Issues number', fontsize=12)
    # plt.ylim(72000, 558547)
    plt.plot(range(1, len(gasMeasurementsOff)+1), gasMeasurementsOff, 'v', linestyle='-',
             color=colors[0],  markersize=4, label='New Offer')
    plt.plot(range(1, len(gasMeasurementsAcc)+1), gasMeasurementsAcc, 'v', linestyle='-',
             color=colors[1],  markersize=4, label='Accept Offer')
    plt.plot(range(1, len(gasMeasurementsNeg)+1), gasMeasurementsNeg, 'v', linestyle='-',
             color=colors[2],  markersize=4, label='New Negotiation')

    plt.legend(title='')
    # plt.show()
    plt.savefig('./gas-cost22.png', bbox_inches='tight', dpi=300)


def plot31():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(7, 5)
    blue_patch = mpatches.Patch(
        color='tab:blue', label='Enumerating Preferred Extensions of AF method')
    red_patch = mpatches.Patch(
        color='tab:red', label='Reductions of PAF to AF method')

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
    plt.xticks(sxrange, ['0.33\n', '0.5\n5 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n10 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n15 nodes\n(i.e. arguments)', '0.66\n',
                         '0.33\n', '0.5\n20 nodes\n(i.e. arguments)', '0.66\n'])
    plt.xlabel('Edge (i.e. attack) Formation Probability (p)', fontsize=12)

    plt.legend(handles=[blue_patch, red_patch], fontsize='large')
    plt.show()
    #plt.savefig('./gas-cost31.png', bbox_inches='tight', dpi=300)


def plot32():
    matrxT1 = [gasMeasurementsExt[::3], gasMeasurementsRed[::3]]
    matrxT2 = [gasMeasurementsExt[1::3], gasMeasurementsRed[1::3]]
    matrxT3 = [gasMeasurementsExt[2::3], gasMeasurementsRed[2::3]]
    labls = ['Enumerating Preferred\nExtensions of AF method',
             'Reductions of PAF\nto AF (PR3) method']

    # ['tab:blue', 'tab:red', 'tab:green']
    colors = list(mcolors.TABLEAU_COLORS).copy()

    fig, axs = plt.subplots(1, 3, sharey=True, figsize=(7, 5))

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
    axs[1].set_xlabel('Arguments Number (Graph size)', fontsize=12)
    axs[0].set_title('0.33')
    axs[1].set_title('Attack Formation Probability (p)\n0.5')
    axs[2].set_title('0.66')

    # plt.show()
    plt.savefig('./gas-cost32.png', bbox_inches='tight', dpi=300)

def boxplot1():
    # print(boxplotData[1:5])
    # print(len(boxplotData[1:5]))

    figure = plt.figure(figsize =(10, 7))  
    # ax = figure.add_axes([0, 0, 1, 1])  
    ax = figure.add_subplot(111)  
    bp = ax.boxplot(boxplotData)  
    ax.set_xticklabels(['5 nodes', '10 nodes','15 nodes', '20 nodes'])
    plt.ylabel('Computation cost in GAS')  
    plt.xlabel('Number of nodes considered')
    plt.title("Box plot of gas cost for balancing reasons in IHiBO")  
    # ax.get_xaxis().tick_bottom()  
    # ax.get_yaxis().tick_left()    
    plt.show()  
    plt.savefig('./addboxplot.png', bbox_inches='tight', dpi=300)

def boxplot2():
    # print(boxplotData[1:5])
    # print(len(boxplotData[1:5]))

    figure = plt.figure(figsize =(10, 7))  
    # ax = figure.add_axes([0, 0, 1, 1])  
    ax = figure.add_subplot(111)  
    bp = ax.boxplot(boxplotData2)  
    ax.set_xticklabels(['0.33; 5 nodes', '0.33; 10 nodes','0.33; 15 nodes', '0.33; 20 nodes',
                        '0.5; 5 nodes', '0.5; 10 nodes','0.5; 15 nodes', '0.5; 20 nodes',
                        '0.66; 5 nodes', '0.66; 10 nodes', '0.66; 15 nodes', '0.66; 20 nodes'])
    plt.ylabel('Computation cost in GAS')  
    plt.xlabel('Number of nodes considered')
    plt.title("Box plot of gas cost for balancing reasons in IHiBO")  
    # ax.get_xaxis().tick_bottom()  
    # ax.get_yaxis().tick_left()    
    plt.show()  
    plt.savefig('./addboxplot.png', bbox_inches='tight', dpi=300)

def plot41():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(7, 5)
    # blue_patch = mpatches.Patch(
    #     color='tab:blue', label='Enumerating Preferred Extensions of AF method')
    # red_patch = mpatches.Patch(
    #     color='tab:red', label='Reductions of PAF to AF method')
    patches = mpatches.Patch(
        label='Additive Method of Balancing')

    sxrange = []
    width = 0.4
    j = -1
    for i in range(len(gasMeasurementsAdd)):
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
    # plt.title('Balancing Gas Cost', fontdict={'fontsize': 16}, weight='heavy')
    plt.bar(sxrange - (width/4), gasMeasurementsAdd, (width/2),
            align='center')
    plt.xticks(sxrange, ['5 nodes',
                         '10 nodes',
                         '15 nodes',
                         '20 nodes'])
    # plt.xlabel('Edge (i.e. attack) Formation Probability (p)', fontsize=12)

    plt.legend(handles=[patches], fontsize='large')
    plt.show()
    plt.savefig('./gas-cost41.png', bbox_inches='tight', dpi=300)

def plot40():
    fig, _ = plt.subplots(nrows=1, ncols=1, constrained_layout=True)
    fig.set_size_inches(10, 5)
    blue_patch = mpatches.Patch(
        color='tab:blue', label='Enumerating Preferred Extensions of AF method')
    red_patch = mpatches.Patch(
        color='tab:red', label='Reductions of PAF to AF method')
    green_patch = mpatches.Patch(
        color='tab:green',label='Additive Method of Balancing')

    sxrange = []
    width = 0.4
    j = -1
    for i in range(len(gasMeasurementsRed)+4):
        if i % 4 == 0:
            j += 1.2
            sxrange.append(i - j + .9 - width)
        elif i % 4 == 1:
            sxrange.append(i - j)
        else:
            sxrange.append(i - j - .9 + width)

    cntr = 0
    new_sxrange1 = []
    for i in sxrange:
        if(cntr % 4 != 3):
            new_sxrange1.append(i)
        # incrementing counter
        cntr += 1

    print(sxrange)
    print(new_sxrange1)
 
    cntr = 0
    new_sxrange2 = [sxrange[3],sxrange[7],sxrange[11],sxrange[15]]

 

    sxrange = np.array(sxrange)
    new_sxrange1 = np.array(new_sxrange1)
    new_sxrange2 = np.array(new_sxrange2)
    print(sxrange)
    print(new_sxrange1)
    print(new_sxrange2)
    # print(gasMeasurementsAdd)
    # print(gasMeasurementsRed)

    plt.ylabel('Gas Cost', fontsize=12)
    # plt.title('Argumentation Gas Cost', fontdict={'fontsize': 16}, weight='heavy')
    plt.bar(new_sxrange1 - (width/4), gasMeasurementsRed, (width/2), color='tab:red',
            align='center')
    plt.bar(new_sxrange1 + (width/4), gasMeasurementsExt, (width/2), color='tab:blue',
            align='center')
    plt.bar(new_sxrange2, gasMeasurementsAdd, (width/2), color='tab:green',
            align='center')
    plt.xticks(sxrange, ['0.33\n', '0.5\n5 nodes\n(i.e. arguments)', '0.66\n', 'add\n',
                         '0.33\n', '0.5\n10 nodes\n(i.e. arguments)', '0.66\n', 'add\n', 
                         '0.33\n', '0.5\n15 nodes\n(i.e. arguments)', '0.66\n', 'add\n',
                         '0.33\n', '0.5\n20 nodes\n(i.e. arguments)', '0.66\n', 'add\n'])
    plt.xlabel('Edge (i.e. attack) Formation Probability (p)', fontsize=12)

    plt.legend(handles=[blue_patch, red_patch, green_patch], fontsize='large')
    plt.show()
    plt.savefig('./gas-cost40.png', bbox_inches='tight', dpi=300)


# with open('data.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     next(reader)
#     nodesTmp = 5
#     edgesPTmp = 0.33
#     for row in reader:
#         nodesNumber = int(row[0])
#         edgesNumber = int(row[1])
#         edgesP = float(row[2])
#         prefP = float(row[3])
#         reductionPref3 = int(row[4])
#         prefExtensionsGas = int(row[5])

#         if (nodesNumber != nodesTmp or edgesP != edgesPTmp):
#             nodesTmp = nodesNumber
#             edgesPTmp = edgesP
#             gasMeasurementsRed.append(np.mean(tmpGasRed))
#             gasMeasurementsExt.append(np.mean(tmpGasExt))
#             tmpGasRed = []
#             tmpGasExt = []
#         tmpGasRed.append(reductionPref3)
#         tmpGasExt.append(prefExtensionsGas)
#     gasMeasurementsRed.append(np.mean(tmpGasRed))
#     gasMeasurementsExt.append(np.mean(tmpGasExt))
#     # plot11()
#     plot12()

# with open('data2.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     next(reader)
#     for row in reader:
#         gasMeasurementsNeg.append(int(row[1]))
#         gasMeasurementsOff.append(int(row[2]))
#         gasMeasurementsAcc.append(int(row[3]))
#     # plot21()
#     plot22()

# with open('data3.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     next(reader)
#     nodesTmp = 5
#     edgesPTmp = 0.33
#     for row in reader:
#         nodesNumber = int(row[0])
#         edgesNumber = int(row[1])
#         edgesP = float(row[2])
#         prefP = float(row[3])
#         reductionPref3 = int(row[4])
#         prefExtensionsGas = int(row[5])

#         if (nodesNumber != nodesTmp or edgesP != edgesPTmp):
#             nodesTmp = nodesNumber
#             edgesPTmp = edgesP
#             gasMeasurementsRed.append(np.mean(tmpGasRed))
#             gasMeasurementsExt.append(np.mean(tmpGasExt))
#             tmpGasRed = []
#             tmpGasExt = []
#         tmpGasRed.append(reductionPref3)
#         tmpGasExt.append(prefExtensionsGas)
#     gasMeasurementsRed.append(np.mean(tmpGasRed))
#     gasMeasurementsExt.append(np.mean(tmpGasExt))
#     plot31()
#     plot32()

# with open('data4.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     next(reader)
#     nodesTmp = 5
#     votePTmp = 0.5
#     for row in reader:
#         nodesNumber = int(row[0])
#         voteP = float(row[1])
#         additiveGas = int(row[2])

#         if (nodesNumber != nodesTmp or voteP != votePTmp):
#             nodesTmp = nodesNumber
#             votePTmp = voteP
#             gasMeasurementsAdd.append(np.mean(tmpGasAdd))
#             tmpGasAdd = []
#         tmpGasAdd.append(additiveGas)
#     gasMeasurementsAdd.append(np.mean(tmpGasAdd))
#     plot41()
#     # plot42()


# with open('data4.csv', 'r') as csvFile:
#     reader = csv.reader(csvFile)
#     next(reader)
#     nodesTmp = 5
#     votePTmp = 0.65
#     tmp = []
#     for row in reader:
#         nodesNumber = int(row[0])
#         voteP = float(row[1])
#         additiveGas = int(row[2])

#         if (nodesNumber != nodesTmp or voteP != votePTmp):
#             nodesTmp = nodesNumber
#             votePTmp = voteP
#             boxplotData.append(tmp)
#             tmp = []
#         tmp.append(additiveGas)
#     boxplotData.append(tmp)
#     boxplot1()

with open('data.csv', 'r') as csvFile:
    reader = csv.reader(csvFile)
    next(reader)
    nodesTmp = 5
    edgesPTmp = 0.33
    tmp = []
    for row in reader:
        nodesNumber = int(row[0])
        edgesNumber = int(row[1])
        edgesP = float(row[2])
        prefP = float(row[3])
        reductionGas = int(row[4])
        extensionGas = int(row[5])
        totalGas = reductionGas + extensionGas

        if (nodesNumber != nodesTmp or edgesP != edgesPTmp):
            nodesTmp = nodesNumber
            edgesPTmp = edgesP
            boxplotData2.append(tmp)
            tmp = []
        tmp.append(totalGas)
    boxplotData2.append(tmp)
    boxplot2()

# with open('data.csv', 'r') as csvFile1, open('data4.csv', 'r') as csvFile2:
#         reader1 = csv.reader(csvFile1)
#         reader2 = csv.reader(csvFile2)
#         next(reader1)
#         next(reader2)
#         nodesTmp1 = 5
#         nodesTmp2 = 5
#         edgesPTmp = 0.33
#         votePTmp = 0.5
#         for row1, row2 in zip(reader1,reader2):
#             nodesNumber1 = int(row1[0])
#             edgesNumber = int(row1[1])
#             edgesP = float(row1[2])
#             prefP = float(row1[3])
#             reductionPref3 = int(row1[4])
#             prefExtensionsGas = int(row1[5])

#             nodesNumber2 = int(row2[0])
#             voteP = float(row2[1])
#             additiveGas = int(row2[2])

#             if (nodesNumber1 != nodesTmp1 or edgesP != edgesPTmp):
#                 nodesTmp1 = nodesNumber1
#                 edgesPTmp = edgesP
#                 votePTmp = voteP
#                 gasMeasurementsRed.append(np.mean(tmpGasRed))
#                 gasMeasurementsExt.append(np.mean(tmpGasExt))
#                 tmpGasRed = []
#                 tmpGasExt = []
#             if (nodesNumber2 != nodesTmp2 or voteP != votePTmp):
#                 nodesTmp2 = nodesNumber2
#                 votePTmp = voteP
#                 gasMeasurementsAdd.append(np.mean(tmpGasAdd))
#                 tmpGasAdd = []
#             tmpGasRed.append(reductionPref3)
#             tmpGasExt.append(prefExtensionsGas)
#             tmpGasAdd.append(additiveGas)
#         gasMeasurementsRed.append(np.mean(tmpGasRed))
#         gasMeasurementsExt.append(np.mean(tmpGasExt))
#         gasMeasurementsAdd.append(np.mean(tmpGasAdd))
#         # plot41()
#         plot40()