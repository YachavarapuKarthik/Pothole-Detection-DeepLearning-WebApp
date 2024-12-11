# The glob module is used for filename pattern matching, which helps in retrieving all files
# Os module for file path manipulation and directory management
import glob, os

# Get the absolute path of the current directory where this script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Print the current directory path
print(current_dir)

# Set the directory where the .jpg files are located
current_dir = 'data/obj'

# Define the percentage of data to be used for the test set (10%)
percentage_test = 10

# Open file handles for the training and test sets
file_train = open('data/train.txt', 'w')
file_test = open('data/test.txt', 'w')

# Initialize a counter to keep track of the number of processed images
counter = 1

# Calculate the index at which to switch between train and test data (1 out of every 10 images for the test set)
index_test = round(100 / percentage_test)

# Iterate through all .jpg files in the specified directory
for pathAndFilename in glob.iglob(os.path.join(current_dir, "*.jpg")):
    # Get the base name of the file (without path and extension)
    title, ext = os.path.splitext(os.path.basename(pathAndFilename))

    # If the counter matches the index for the test set, add this image to the test file
    if counter == index_test:
        counter = 1  # Reset the counter to 1 after writing a test entry
        file_test.write("data/obj" + "/" + title + '.jpg' + "\n")  # Write to the test file
    else:
        # Otherwise, add this image to the training file
        file_train.write("data/obj" + "/" + title + '.jpg' + "\n")  # Write to the train file
        counter = counter + 1  # Increment the counter to track image selection