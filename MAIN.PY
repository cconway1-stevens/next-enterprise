import os

def add_comment_to_files(directory, comment, extensions):
    for root, _, files in os.walk(directory):
        for filename in files:
            if filename.endswith(tuple(extensions)) and not root.startswith('./node_modules'):
                filepath = os.path.join(root, filename)
                add_comment(filepath, comment)

def add_comment(filepath, comment):
    with open(filepath, 'r+') as file:
        content = file.read()
        file.seek(0, 0)  # Move the cursor to the beginning of the file
        file.write(f'// {comment} {os.path.relpath(filepath)}\n')  # Add the comment with the relative path
        file.write(content)

if __name__ == '__main__':
    directory_path = '/path/to/your/directory'  # Replace this with the path to your target directory
    comment_text = 'Added by my script:'  # Replace this with the desired comment text
    allowed_extensions = ['.js', '.ts', '.tsx']  # Add more extensions as needed

    add_comment_to_files(directory_path, comment_text, allowed_extensions)
