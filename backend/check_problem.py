import asyncio
from database import db
from bson import ObjectId

async def check_problem():
    problem = await db.problems.find_one({'_id': ObjectId('68e8006816123621c4fdd3d7')})
    if problem:
        print(f"Problem: {problem.get('title')}")
        print(f"Slug: {problem.get('slug')}")
        print(f"Function name: {problem.get('function_name', 'solution')}")
        print(f"\nBoilerplate (python):")
        print(problem.get('boilerplates', {}).get('python', 'None'))
        print(f"\nWrapper code exists: {bool(problem.get('wrapper_code', {}).get('python'))}")
        print(f"Input parsing exists: {bool(problem.get('input_parsing', {}).get('python'))}")
    else:
        print("Problem not found")

if __name__ == "__main__":
    asyncio.run(check_problem())
